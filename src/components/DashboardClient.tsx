"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import axios from "axios";

function DashboardClient({ ownerId }: { ownerId: string }) {
  const navigate = useRouter();
  const [businessName, setBusinessName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSettings = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/settings", {
        ownerId,
        businessName,
        supportEmail,
        knowledgeBase,
      });
      console.log(result.data);
      //setLoading(false);
      localStorage.setItem(
        `chatbot_settings_${ownerId}`,
        JSON.stringify({
          businessName,
          supportEmail,
          knowledgeBase,
        }),
      );
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
      }, 3000);
    } catch (err) {
      console.log(err);
      //setLoading(false);
    } finally {
      setLoading(false); // always runs
    }
  };

  // useEffect(() => {
  //   if (ownerId) {
  //     const handleGetDetails = async () => {
  //       try {
  //         const result = await axios.post("/api/settings/get", { ownerId });
  //         setBusinessName(result.data.businessName);
  //         setSupportEmail(result.data.supportEmail);
  //         setKnowledgeBase(result.data.knowledgeBase);
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     };
  //     handleGetDetails();
  //   }
  // }, [ownerId]);

  //! Load instantly from localStorage on refresh
  useEffect(() => {
    const saved = localStorage.getItem(`chatbot_settings_${ownerId}`);

    if (saved) {
      const data = JSON.parse(saved);
      setBusinessName(data.businessName || "");
      setSupportEmail(data.supportEmail || "");
      setKnowledgeBase(data.knowledgeBase || "");
    }
  }, [ownerId]);

  useEffect(() => {
    if (!ownerId) return; // !stop if ownerId not ready

    const handleGetDetails = async () => {
      try {
        setLoading(true);

        const result = await axios.post("/api/settings/get", {
          ownerId,
        });

        if (result.data) {
          setBusinessName(result.data.businessName || "");
          setSupportEmail(result.data.supportEmail || "");
          setKnowledgeBase(result.data.knowledgeBase || "");
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    handleGetDetails();
  }, [ownerId]);

  // ! Save to localStorage whenever values change
  useEffect(() => {
    if (!ownerId) return;
    localStorage.setItem(
      `chatbot_settings_${ownerId}`,
      JSON.stringify({
        businessName,
        supportEmail,
        knowledgeBase,
      }),
    );
  }, [businessName, supportEmail, knowledgeBase, ownerId]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <motion.div
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-zinc-200"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="text-xl font-semibold cursor-pointer"
            onClick={() => navigate.push("/")}
          >
            Support <span className="text-zinc-400">AI</span>
          </div>
          <button className="px-4 py-2 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 transition cursor-pointer"
            onClick={() => navigate.push("/embed")}
          >
            Embed Chatbot
          </button>
        </div>
      </motion.div>

      {/* {Main Content} */}
      <div className="flex justify-center px-4 py-14 mt-20 ">
        <motion.div className="w-full max-w-3xl p-10 bg-white shadow-xl rounded-2xl">
          <div className="mb-10 ">
            <h1 className="text-2xl font-semibold">Chatbot Settings</h1>
            <p className="text-zinc-500 mt-1">
              Manage your AI Chatbot knowledge and business details
            </p>
          </div>
          <div className="mb-10 ">
            <h1 className="text-lg font-semibold mb-4">Business Details</h1>
            <div className="space-y-4">
              <input
                type="text"
                className="w-full rounded-xl border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                placeholder="Business Name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
              <input
                type="text"
                className="w-full rounded-xl border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                placeholder="Support Email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-10 ">
            <h1 className="text-lg font-semibold mb-4">Knowledge Base</h1>
            <p className="text-sm text-zinc-500 mb-4">
              Add FAQs , policies , delivery info , refunds , etc..
            </p>
            <div className="space-y-4">
              <textarea
                className="w-full h-54 rounded-xl border-zinc-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/80"
                placeholder={`Example:
                  • Refund policy: 7 days return available
                  • Delivery time: 3–5 working days
                  • Cash on Delivery available
                  • Support hours`}
                onChange={(e) => setKnowledgeBase(e.target.value)}
                value={knowledgeBase}
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              onClick={handleSettings}
              className="px-7 py-3 rounded-xl bg-black text-white text-sm font-medium hover:bg-zinc-800 transition disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Saving..." : "Save"}
            </motion.button>

            {saved && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium text-emerald-600"
              >
                ✅ Settings Saved
              </motion.span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardClient;
