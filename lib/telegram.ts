interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface OrderData {
  customerName: string;
  phone: string;
  city: string;
  address: string;
  paymentMethod: string;
  items: OrderItem[];
  totalPrice: number;
}

function formatOrderMessage(order: OrderData): string {
  const itemsList = order.items
    .map((item, i) =>
      `  ${i + 1}. ${item.name} × ${item.quantity} — $${(item.price * item.quantity).toFixed(2)}\n      🖼 ${item.image}`
    )
    .join('\n');

  return `🛍 طلب جديد من Europe Chic\n\n👤 الاسم: ${order.customerName}\n📞 الهاتف: ${order.phone}\n🏙 المدينة: ${order.city}\n📍 العنوان: ${order.address}\n💳 الدفع: ${order.paymentMethod}\n\n📦 المنتجات:\n${itemsList}\n\n💰 المجموع: $${order.totalPrice.toFixed(2)}`;
}

export async function sendOrderToTelegram(order: OrderData): Promise<boolean> {
  const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
  const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

  if (!botToken || botToken === 'YOUR_BOT_TOKEN' || !chatId || chatId === 'YOUR_CHAT_ID') {
    console.log('📩 [Telegram Mock] Order:', formatOrderMessage(order));
    return true;
  }

  try {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: formatOrderMessage(order),
        disable_web_page_preview: true,
      }),
    });
    return res.ok;
  } catch (err) {
    console.error('Telegram send failed:', err);
    return false;
  }
}
