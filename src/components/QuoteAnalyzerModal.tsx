import React, { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  FileDown,
  Loader2,
  MessageSquare,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
  UploadCloud,
  User as UserIcon,
  X,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { useAuth, type User } from "@/context/AuthContext";
import {
  analyzeFile,
  askQuestion,
  downloadBlob,
  generateRevisedQuote,
  type RevisedQuoteResult,
} from "@/lib/analyzerApi";

type Tab = "upload" | "chat";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  loading?: boolean;
};

type AnalysisState = {
  status: "idle" | "loading" | "done" | "error";
  result: string;
  error: string;
};

type RevisedState = {
  status: "idle" | "loading" | "done" | "error";
  data: RevisedQuoteResult | null;
  error: string;
};

function createWelcomeMessage(user: User | null): ChatMessage {
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return {
    id: "welcome",
    role: "assistant",
    text: `Hi ${firstName}! Ask me anything about contractor pricing, material costs, or labor rates in your city. I'll do my best to help with a data-backed answer.`,
  };
}

function formatResponse(text: string) {
  const lines = text.split("\n").filter(Boolean);

  return (
    <div className="space-y-2 text-sm leading-relaxed text-slate-700">
      {lines.map((line, index) => {
        if (line.startsWith("##")) {
          return (
            <h3
              key={`${index}-${line}`}
              className="mt-3 text-base font-bold text-slate-900"
            >
              {line.replace(/^##\s*/, "")}
            </h3>
          );
        }

        if (line.startsWith("#")) {
          return (
            <h2
              key={`${index}-${line}`}
              className="mt-4 text-lg font-extrabold text-slate-900"
            >
              {line.replace(/^#\s*/, "")}
            </h2>
          );
        }

        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div
              key={`${index}-${line}`}
              className="flex items-start gap-2"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
              <span>{line.replace(/^[-*]\s*/, "")}</span>
            </div>
          );
        }

        if (/^\d+\./.test(line)) {
          return (
            <div key={`${index}-${line}`} className="pl-2">
              {line}
            </div>
          );
        }

        if (
          /\bRs\b/i.test(line) ||
          line.includes("%") ||
          line.toLowerCase().includes("overpriced") ||
          line.toLowerCase().includes("cost")
        ) {
          return (
            <p key={`${index}-${line}`} className="font-medium text-slate-800">
              {line}
            </p>
          );
        }

        return <p key={`${index}-${line}`}>{line}</p>;
      })}
    </div>
  );
}

export default function QuoteAnalyzerModal() {
  const { analyzerOpen, closeAnalyzer, user } = useAuth();
  const [tab, setTab] = useState<Tab>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [generateRevised, setGenerateRevised] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    status: "idle",
    result: "",
    error: "",
  });
  const [revised, setRevised] = useState<RevisedState>({
    status: "idle",
    data: null,
    error: "",
  });
  const [messages, setMessages] = useState<ChatMessage[]>([
    createWelcomeMessage(user),
  ]);
  const [query, setQuery] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!analyzerOpen) {
      return;
    }

    setTab("upload");
    setFile(null);
    setDragging(false);
    setGenerateRevised(false);
    setAnalysis({ status: "idle", result: "", error: "" });
    setRevised({ status: "idle", data: null, error: "" });
    setMessages([createWelcomeMessage(user)]);
    setQuery("");
    setChatLoading(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [analyzerOpen, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);

    const droppedFile = event.dataTransfer.files[0];

    if (
      droppedFile &&
      (droppedFile.type === "application/pdf" ||
        droppedFile.type.startsWith("image/"))
    ) {
      setFile(droppedFile);
      setAnalysis({ status: "idle", result: "", error: "" });
      setRevised({ status: "idle", data: null, error: "" });
    }
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setAnalysis({ status: "idle", result: "", error: "" });
      setRevised({ status: "idle", data: null, error: "" });
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      return;
    }

    setAnalysis({ status: "loading", result: "", error: "" });
    setRevised({ status: "idle", data: null, error: "" });

    try {
      const result = await analyzeFile(file);
      setAnalysis({ status: "done", result: result.text, error: "" });

      if (generateRevised) {
        setRevised({ status: "loading", data: null, error: "" });

        try {
          const revisedResult = await generateRevisedQuote(file);
          setRevised({ status: "done", data: revisedResult, error: "" });
        } catch (error) {
          setRevised({
            status: "error",
            data: null,
            error:
              error instanceof Error
                ? error.message
                : "Failed to generate the revised quote.",
          });
        }
      }
    } catch (error) {
      setAnalysis({
        status: "error",
        result: "",
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong while analyzing your quote.",
      });
    }
  };

  const handleDownload = () => {
    if (!revised.data) {
      return;
    }

    downloadBlob(revised.data.blob, revised.data.filename);
  };

  const handleSend = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || chatLoading) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}`,
      role: "user",
      text: trimmedQuery,
    };
    const loadingMessage: ChatMessage = {
      id: `${Date.now()}-loading`,
      role: "assistant",
      text: "",
      loading: true,
    };

    setMessages((current) => [...current, userMessage, loadingMessage]);
    setQuery("");
    setChatLoading(true);

    try {
      const answer = await askQuestion(trimmedQuery);
      setMessages((current) =>
        current.map((message) =>
          message.loading
            ? { ...message, loading: false, text: answer }
            : message,
        ),
      );
    } catch (error) {
      setMessages((current) =>
        current.map((message) =>
          message.loading
            ? {
                ...message,
                loading: false,
                text:
                  error instanceof Error
                    ? `Error: ${error.message}`
                    : "Error: Could not reach the backend service.",
              }
            : message,
        ),
      );
    } finally {
      setChatLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  const resetUpload = () => {
    setFile(null);
    setAnalysis({ status: "idle", result: "", error: "" });
    setRevised({ status: "idle", data: null, error: "" });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!analyzerOpen) {
    return null;
  }

  const isAnalyzing =
    analysis.status === "loading" || revised.status === "loading";

  return (
    <AnimatePresence>
      <motion.div
        key="analyzer-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeAnalyzer();
          }
        }}
      >
        <motion.div
          key="analyzer-modal"
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
        >
          <div className="shrink-0 bg-slate-900 px-6 pb-4 pt-6">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <BrandLogo
                  className="mb-4 text-base"
                  iconClassName="h-8 w-8"
                  textClassName="text-white"
                />
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">
                    Quote Analyzer
                  </span>
                  <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                    FREE
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Upload a quote or ask pricing questions in one place.
                </p>
              </div>

              <button
                onClick={closeAnalyzer}
                className="p-1 text-slate-400 transition-colors hover:text-white"
                aria-label="Close quote analyzer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-1 rounded-xl bg-white/10 p-1">
              <button
                onClick={() => setTab("upload")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                  tab === "upload"
                    ? "bg-white text-slate-900"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <UploadCloud size={15} />
                Upload and Analyze
              </button>
              <button
                onClick={() => setTab("chat")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-semibold transition-all ${
                  tab === "chat"
                    ? "bg-white text-slate-900"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <MessageSquare size={15} />
                Ask a Question
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {tab === "upload" && (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex-1 space-y-4 overflow-y-auto p-6"
                >
                  <p className="text-sm text-slate-500">
                    Upload your contractor quote as a PDF or image and get a
                    quick AI review of likely margins, costs, and savings.
                  </p>

                  {!file && (
                    <div
                      onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
                        dragging
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-200 hover:border-emerald-300 hover:bg-slate-50"
                      }`}
                    >
                      <UploadCloud
                        size={36}
                        className={`mx-auto mb-3 ${
                          dragging ? "text-emerald-500" : "text-slate-300"
                        }`}
                      />
                      <p className="text-sm font-semibold text-slate-700">
                        Drop your quote here
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Or click to browse. PDF and image files are supported.
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,image/*"
                        className="hidden"
                        onChange={handleFileSelect}
                      />
                    </div>
                  )}

                  {file && (
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <FileText size={20} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        onClick={resetUpload}
                        className="text-slate-400 transition-colors hover:text-red-500"
                        aria-label="Remove selected file"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}

                  {file && analysis.status !== "done" && (
                    <button
                      type="button"
                      onClick={() =>
                        setGenerateRevised((current) => !current)
                      }
                      className={`flex w-full items-start gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                        generateRevised
                          ? "border-emerald-400 bg-emerald-50"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-all ${
                          generateRevised
                            ? "border-emerald-500 bg-emerald-500"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {generateRevised && (
                          <svg viewBox="0 0 10 8" fill="none" className="h-3 w-3">
                            <path
                              d="M1 4l2.5 2.5L9 1"
                              stroke="white"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="mb-0.5 flex items-center gap-2">
                          <span
                            className={`text-sm font-semibold ${
                              generateRevised
                                ? "text-emerald-800"
                                : "text-slate-800"
                            }`}
                          >
                            Generate revised quote file
                          </span>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                            NEW
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-slate-500">
                          After analysis, AI will create a corrected quote with
                          fair market prices ready to download as a file.
                        </p>

                        {generateRevised && (
                          <div className="mt-2 flex items-center gap-1.5 text-emerald-700">
                            <Sparkles size={12} />
                            <span className="text-[11px] font-semibold">
                              Analysis report and revised quote file will both
                              be generated
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  )}

                  {file && analysis.status !== "done" && (
                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="h-12 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      {analysis.status === "loading" ? (
                        <span className="flex items-center gap-2">
                          <Loader2 size={16} className="animate-spin" />
                          Analyzing your quote...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <ChevronRight size={16} />
                          {generateRevised
                            ? "Analyze and Generate Revised Quote"
                            : "Analyze Quote"}
                        </span>
                      )}
                    </Button>
                  )}

                  {analysis.status === "loading" && (
                    <div className="rounded-2xl bg-slate-50 p-5">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
                          <Loader2
                            size={16}
                            className="animate-spin text-emerald-600"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Analyzing your quote...
                          </p>
                          <p className="text-xs text-slate-500">
                            Checking line items against market signals
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {[
                          "Reading the document",
                          "Parsing line items",
                          "Comparing market rates",
                          "Estimating contractor margin",
                        ].map((step) => (
                          <div key={step} className="flex items-center gap-2">
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200">
                              <Loader2
                                size={10}
                                className="animate-spin text-slate-400"
                              />
                            </div>
                            <span className="text-xs text-slate-500">
                              {step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.status === "error" && (
                    <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                      <AlertCircle
                        size={20}
                        className="mt-0.5 shrink-0 text-red-500"
                      />
                      <div>
                        <p className="text-sm font-semibold text-red-700">
                          Analysis failed
                        </p>
                        <p className="mt-0.5 text-xs text-red-600">
                          {analysis.error}
                        </p>
                        <p className="mt-2 text-xs text-red-400">
                          Make sure `VITE_BACKEND_URL` and `VITE_API_KEY` are set
                          correctly in your `.env` file.
                        </p>
                      </div>
                    </div>
                  )}

                  {analysis.status === "done" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-emerald-700">
                        <CheckCircle2 size={18} />
                        <span className="text-sm font-semibold">
                          Analysis complete
                        </span>
                      </div>

                      <div className="max-h-80 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-5">
                        {formatResponse(analysis.result)}
                      </div>

                      {generateRevised && (
                        <AnimatePresence>
                          {revised.status === "loading" && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50 p-4"
                            >
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100">
                                <Loader2
                                  size={16}
                                  className="animate-spin text-indigo-600"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-indigo-800">
                                  Generating revised quote...
                                </p>
                                <p className="text-xs text-indigo-500">
                                  Building a corrected quote with fair market
                                  prices
                                </p>
                              </div>
                            </motion.div>
                          )}

                          {revised.status === "done" && revised.data && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5"
                            >
                              <div className="mb-4 flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100">
                                  <FileDown
                                    size={20}
                                    className="text-emerald-700"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="mb-0.5 flex items-center gap-2">
                                    <p className="text-sm font-bold text-emerald-900">
                                      Revised Quote Ready
                                    </p>
                                    <span className="rounded-full bg-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-800">
                                      {revised.data.isPdf ? "PDF" : "TXT"}
                                    </span>
                                  </div>
                                  <p className="text-xs text-emerald-700">
                                    A corrected quote with fair market prices is
                                    ready to download and use in negotiations.
                                  </p>
                                </div>
                              </div>

                              {!revised.data.isPdf && (
                                <div className="mb-4 max-h-40 overflow-y-auto rounded-xl border border-emerald-100 bg-white/70 p-3">
                                  {formatResponse(revised.data.text)}
                                </div>
                              )}

                              <Button
                                onClick={handleDownload}
                                className="h-11 w-full rounded-xl bg-emerald-700 text-sm font-bold text-white hover:bg-emerald-800"
                              >
                                <Download size={16} className="mr-2" />
                                Download {revised.data.filename}
                              </Button>
                            </motion.div>
                          )}

                          {revised.status === "error" && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4"
                            >
                              <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0 text-amber-500"
                              />
                              <div>
                                <p className="text-sm font-semibold text-amber-800">
                                  Revised quote generation failed
                                </p>
                                <p className="mt-0.5 text-xs text-amber-600">
                                  {revised.error}
                                </p>
                                <p className="mt-1 text-xs text-amber-500">
                                  Make sure your backend exposes a{" "}
                                  <code className="rounded bg-amber-100 px-1">
                                    /generate-quote
                                  </code>{" "}
                                  endpoint.
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      )}

                      <div className="flex gap-2">
                        <Button
                          onClick={resetUpload}
                          variant="outline"
                          size="sm"
                          className="rounded-xl text-xs"
                        >
                          <RotateCcw size={13} />
                          Analyze another
                        </Button>
                        <Button
                          onClick={() => setTab("chat")}
                          size="sm"
                          className="rounded-xl bg-slate-900 text-xs text-white hover:bg-slate-800"
                        >
                          Ask follow-up questions
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {tab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex flex-1 flex-col overflow-hidden"
                >
                  <div className="flex-1 space-y-4 overflow-y-auto p-5">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.role === "user" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                            message.role === "assistant"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-900 text-white"
                          }`}
                        >
                          {message.role === "assistant" ? (
                            <Bot size={15} />
                          ) : (
                            <UserIcon size={15} />
                          )}
                        </div>

                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                            message.role === "user"
                              ? "rounded-tr-sm bg-slate-900 text-white"
                              : "rounded-tl-sm border border-slate-100 bg-slate-50 text-slate-700"
                          }`}
                        >
                          {message.loading ? (
                            <div className="flex items-center gap-2 text-slate-400">
                              <Loader2
                                size={13}
                                className="animate-spin"
                              />
                              <span className="text-xs">Thinking...</span>
                            </div>
                          ) : message.role === "assistant" ? (
                            formatResponse(message.text)
                          ) : (
                            <p>{message.text}</p>
                          )}
                        </div>
                      </div>
                    ))}

                    <div ref={chatEndRef} />
                  </div>

                  <div className="shrink-0 border-t border-slate-100 p-4">
                    <div className="flex items-end gap-2">
                      <textarea
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g. Is Rs 450/sqft for a modular kitchen fair in Bangalore?"
                        rows={2}
                        className="flex-1 resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500"
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!query.trim() || chatLoading}
                        className="h-11 w-11 shrink-0 rounded-xl bg-emerald-600 p-0 text-white hover:bg-emerald-700"
                      >
                        {chatLoading ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                      </Button>
                    </div>
                    <p className="mt-2 text-center text-[10px] text-slate-400">
                      Press Enter to send. Shift+Enter adds a new line.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
