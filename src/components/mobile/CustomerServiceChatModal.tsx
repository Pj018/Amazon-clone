import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatMessage } from '../../types';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Package,
  RotateCcw,
  Headphones,
  CheckCircle2
} from 'lucide-react';

export const CustomerServiceChatModal: React.FC = () => {
  const {
    isCustomerServiceOpen,
    setIsCustomerServiceOpen,
    orders,
    setActiveTab,
    addToast
  } = useApp();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'amazon_bot',
      text: 'Hello Alex! I am your 24/7 Amazon Customer Care Assistant. How can I help you today?',
      timestamp: 'Just now',
      actionButtons: [
        { label: 'Track Recent Order', action: 'track_order' },
        { label: 'Refund or Return', action: 'refund' },
        { label: 'Change Delivery Address', action: 'address' },
        { label: 'Prime Benefits', action: 'prime' },
      ]
    }
  ]);

  if (!isCustomerServiceOpen) return null;

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Automated assistant reply
    setTimeout(() => {
      let replyText = "I understand. I'm checking your Amazon Prime account records right now...";
      let buttons: { label: string; action: string }[] | undefined = undefined;

      const lower = userText.toLowerCase();
      if (lower.includes('track') || lower.includes('order') || lower.includes('where')) {
        const latestOrder = orders[0];
        if (latestOrder) {
          replyText = `Your order #${latestOrder.id} (${latestOrder.items[0]?.title.slice(0, 30)}...) is currently "${latestOrder.status}" and ${latestOrder.estimatedDelivery}.`;
          buttons = [{ label: 'View in Orders Tab', action: 'goto_orders' }];
        } else {
          replyText = 'You do not have any pending orders in transit right now.';
        }
      } else if (lower.includes('return') || lower.includes('refund')) {
        replyText = 'Amazon offers free 30-day returns with drop-off at thousands of Whole Foods and UPS locations. No box or label needed. Would you like to start a return?';
        buttons = [{ label: 'Open Returns Center', action: 'goto_returns' }];
      } else if (lower.includes('prime')) {
        replyText = 'Your Amazon Prime Membership is active with unlimited Free One-Day delivery, Prime Video, and exclusive Lightning Deals!';
      } else if (lower.includes('human') || lower.includes('agent')) {
        replyText = 'Connecting you with a Senior Prime Customer Service Associate... (Priority queue: ETA < 1 minute).';
      } else {
        replyText = `Thank you for asking about "${userText}". All shipments are covered by the Amazon A-to-z 100% money-back guarantee.`;
        buttons = [{ label: 'Track Recent Order', action: 'track_order' }];
      }

      const botMsg: ChatMessage = {
        id: 'bot-' + Date.now(),
        sender: 'amazon_bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionButtons: buttons
      };

      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const handleActionButton = (action: string) => {
    if (action === 'track_order' || action === 'goto_orders' || action === 'refund' || action === 'goto_returns') {
      setActiveTab('customer_hub');
      setIsCustomerServiceOpen(false);
      addToast('info', 'Navigated to your Orders & Returns Center');
    } else if (action === 'address') {
      setActiveTab('customer_hub');
      setIsCustomerServiceOpen(false);
    } else if (action === 'prime') {
      handleSend('What are my Prime benefits?');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCustomerServiceOpen(false)}
      />

      {/* Surface */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#181c1d] text-slate-900 dark:text-slate-100 rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col h-[85vh] z-10 border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200">
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-3 sm:hidden" />

        {/* Header */}
        <div className="px-4 py-3 bg-[#131921] text-white flex items-center justify-between border-b border-[#232F3E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FF9900] text-slate-950 font-black flex items-center justify-center text-xs">
              AMZ
            </div>
            <div>
              <div className="text-xs font-bold flex items-center gap-1.5">
                <span>Amazon Customer Care</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="text-[10px] text-slate-400">24/7 Verified Support</div>
            </div>
          </div>
          <button
            onClick={() => setIsCustomerServiceOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[82%] p-3 rounded-2xl ${
                  msg.sender === 'user'
                    ? 'bg-[#FF9900] text-slate-950 rounded-br-xs font-medium'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs'
                }`}
              >
                <p className="leading-relaxed">{msg.text}</p>
                <span className="text-[9px] opacity-60 block mt-1 text-right">
                  {msg.timestamp}
                </span>
              </div>

              {/* Bot suggested action buttons */}
              {msg.actionButtons && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {msg.actionButtons.map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionButton(btn.action)}
                      className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-[#FFD814] dark:hover:bg-[#FFD814] hover:text-slate-950 border border-slate-300 dark:border-slate-700 text-[11px] font-semibold transition"
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message or issue..."
            className="flex-1 px-3 py-2 text-xs rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-[#FF9900]"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="p-2 rounded-full bg-[#FF9900] text-slate-950 font-bold hover:bg-[#e68a00] disabled:opacity-40 transition shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
