import Order from "../models/Order.js";
import { ROLES } from "../utils/constants.js";
import User from "../models/User.js";

export const getOrderByUserId = async (req, res) => {
  const { userId } = req.user;

  try {
    const orders = await Order.find({ userId }).populate({
      path: "products._id",
      select: "name price images category",
    });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Orders not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllOrders = async (req, res) => {
  if (req.role !== ROLES.admin)
    return res.status(401).json({
      success: false,
      message: "Access not denied",
    });

  const { limit, page } = req.query;

  try {
    const orders = await Order.find()
      .populate({
        path: "products.id",
        select: "name price category images",
      })
      .populate({
        path: "userId",
        select: "name email",
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    if (!orders || orders.length > 0) {
      return res.status(404).json({
        success: false,
        message: "order not found",
      });
    }
    const count = await Order.countDocuments();
    return res.status(200).json({
      success: true,
      date: orders,
      totalpages: Math.ceil(count / limit),
      currentPages: Number(page),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(403).json({
      success: false,
      message: "You are not authrized this resource",
    });
  }

  const { paymentId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findOneAndUpadate(
      { rezorpayPaymentId: paymentId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: order,
      message: "Order status updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMetrics = async (req, res) => {
  try {
    if (req.role !== ROLES.admin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }

    const { startdate, endDate } = req.query;

    const start = new Date(startdate || new Date().setMonth(new Date().getMonth() - 1));
    const end = new Date(endDate || new Date());

    // Calculate total sales
    const orderInRange = await Order.find({
      createdAt: { $gte: start, $lt: end },
    });

    const totalSales = orderInRange.reduce((acc, order) => acc + order.totalPrice, 0);

    // Get last month’s date range
    const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1));

    // Calculate last month's sales
    const lastMonthOrders = await Order.find({
      createdAt: { $gte: lastMonth, $lt: start },
    });

    const totalLastMonth = lastMonthOrders.reduce((acc, order) => acc + order.totalPrice, 0);
    const totalThisMonth = totalSales;

    // Calculate sales growth percentage
    const salesGrowth = totalLastMonth ? ((totalThisMonth - totalLastMonth) / totalLastMonth) * 100 : 0;

    // Calculate new users this month vs last month
    const thisMonthUsers = await User.find({ createdAt: { $gte: start, $lt: end } });
    const lastMonthUsers = await User.find({ createdAt: { $gte: lastMonth, $lt: start } });

    const userGrowth = lastMonthUsers.length
      ? ((thisMonthUsers.length - lastMonthUsers.length) / lastMonthUsers.length) * 100
      : 0;

    // Calculate orders in the last hour
    const lastHour = new Date(new Date().setHours(new Date().getHours() - 1));

    const lastHourOrders = await Order.find({
      createdAt: { $gte: lastHour, $lte: new Date() },
    });

    const previousDayOrders = await Order.find({
      createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 1)) },
    });

    const lastHourGrowth = previousDayOrders.length
      ? (lastHourOrders.length / previousDayOrders.length) * 100
      : 0;

    // Fetch recent sales
    const recentOrders = await Order.find()
      .populate({
        path: "userId",
        select: "email name",
      })
      .sort({ createdAt: -1 })
      .limit(9);

    // Orders from last 6 months grouped by category
    const sixMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 6));

    const sixMonthOrders = await Order.find({
      createdAt: { $gte: sixMonthsAgo },
    }).populate({
      path: "products.id",
      select: "category",
    });

    const monthWise = sixMonthOrders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleString("default", { month: "short" });

      if (!acc[month]) {
        acc[month] = {};
      }

      order.products.forEach((product) => {
        const category = product.id.category;
        acc[month][category] = (acc[month][category] || 0) + 1;
      });

      return acc;
    }, {});

    return res.status(200).json({
      success: true,
      data: {
        totalSales: {
          count: totalSales,
          growth: salesGrowth,
        },
        users: {
          count: thisMonthUsers.length,
          growth: userGrowth,
        },
        sales: {
          count: totalThisMonth,
          growth: salesGrowth,
        },
        activeNow: {
          count: lastHourOrders.length,
          growth: lastHourGrowth,
        },
        recentSales: {
          count: totalThisMonth,
          users: recentOrders,
        },
        sixMonthsBarChartData: monthWise,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

