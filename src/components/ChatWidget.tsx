"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, X, Bot } from "lucide-react";

declare global {
  interface Window {
    leadConnector: any;
  }
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const checkGHLState = () => {
      if (window.leadConnector && window.leadConnector.chatWidget) {
        const active = window.leadConnector.chatWidget.isActive();
        if (active !== isOpen) {
          setIsOpen(active);
        }
      }
    };

    const interval = setInterval(checkGHLState, 500);
    return () => clearInterval(interval);
  }, [isOpen]);

  const toggleGHLWidget = () => {
    if (window.leadConnector && window.leadConnector.chatWidget) {
      window.leadConnector.chatWidget.toggleWidget();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[2147483647] font-mono select-none leading-relaxed">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 30, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-[380px] h-[520px] bg-[#05070a]/95 backdrop-blur-2xl border border-gray-800 rounded-2xl flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(217,255,65,0.05)] mb-6 overflow-hidden pointer-events-none"
          >
            <div className="bg-[#0f1115] border-b border-gray-800 px-5 py-4 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57] shadow-[0_0_8px_rgba(255,95,87,0.5)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e] shadow-[0_0_8px_rgba(254,188,46,0.5)]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840] shadow-[0_0_8px_rgba(40,200,64,0.5)]" />
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-black">
                    live_agent_v3.0.sys
                  </span>
                </div>
              </div>
              <button
                onClick={toggleGHLWidget}
                className="text-gray-500 hover:text-neon p-1 transition-colors"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#0a0c10]/60 px-5 py-2 border-b border-gray-800/40 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neon animate-pulse shadow-[0_0_5px_#D9FF41]" />
                <span className="text-[9px] text-neon uppercase font-bold tracking-widest">
                  Logic: GHL_LINK_ESTABLISHED
                </span>
              </div>
            </div>

            <div 
              className="flex-grow bg-transparent" 
              style={{
                backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')",
                backgroundAttachment: "local"
              }}
            >
              <div className="h-full w-full flex items-center justify-center">
                <div className="text-[9px] text-gray-700 animate-pulse text-center px-10">
                  SYSTEM_ID: leadconnector_6938...
                  <br />
                  SYNCING_UI_BRIDGE...
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <motion.button
          onClick={toggleGHLWidget}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85 }}
          className={`ml-auto w-[68px] h-[68px] bg-[#05070a] border-[1.5px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-400 shadow-[0_10px_40px_rgba(0,0,0,0.6)] ${
            isOpen 
              ? "rotate-90 bg-[#111827] border-gray-700" 
              : "border-neon/20 hover:border-neon hover:shadow-[0_0_35px_rgba(217,255,65,0.5)]"
          }`}
          type="button"
        >
          {isOpen ? (
            <X className="w-9 h-9 text-white" />
          ) : (
            <Bot className="w-9 h-9 text-neon" />
          )}

          {!isOpen && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-black border-2 border-neon rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-neon rounded-full animate-pulse shadow-[0_0_10px_#D9FF41]" />
            </div>
          )}
        </motion.button>

        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-5 pointer-events-none"
            >
              <div className="bg-neon text-black text-[11px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl shadow-[0_15px_30px_rgba(217,255,65,0.4)] relative whitespace-nowrap animate-bounce">
                Build My AI Agent
                <div className="absolute top-full right-7 w-4 h-4 bg-neon rotate-45 -translate-y-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx global>{`
        #chat-widget-container div[class*="launcher"],
        #chat-widget-container button[class*="launcher"],
        .lc-chat-widget-launcher {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }

        #chat-widget-container, 
        .lc-chat-widget-window {
           position: fixed !important;
           bottom: 110px !important;
           right: 24px !important;
           width: 380px !important;
           height: 520px !important;
           z-index: 2147483645 !important;
           border-radius: 16px !important;
           box-shadow: none !important;
           border: none !important;
        }

        .lc-chat-widget-window iframe {
           border-radius: 16px !important;
           background: transparent !important;
        }
      `}</style>
    </div>
  );
}
