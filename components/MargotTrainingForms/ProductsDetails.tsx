import React, { useEffect } from "react";

export default function ProductsDetails() {
  const [productService, setProductService] = React.useState("");
  const [whyChoose, setWhyChoose] = React.useState("");
  const [successStories, setSuccessStories] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Fetch existing product data on mount
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("/api/margot/product", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.ok && data.data) {
          setProductService(data.data.product || "");
          setWhyChoose(data.data.edge || "");
          setSuccessStories(data.data.successStories || "");
        }
      } catch (error) {
        // Silently handle error
      }
    };

    fetchProductData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/margot/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productService,
          edge: whyChoose,
          successStories: successStories,
        }),
      });

      const data = await response.json();

      if (data.ok) {
        setMessage({ type: "success", text: "Product details saved successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Error saving product details" });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setProductService("");
    setWhyChoose("");
    setSuccessStories("");
    setMessage(null);
  };

  return (
    <form onSubmit={handleSubmit} className="self-stretch inline-flex flex-col justify-start items-start gap-5">
      {/* row 1 */}
      <div className="self-stretch py-1 inline-flex justify-start items-start gap-8 flex-wrap content-start">
        <div
          data-actions="False"
          data-help-icon="false"
          data-size="sm"
          data-supporting-text="true"
          className="w-80 max-w-80 min-w-48 inline-flex flex-col justify-start items-start"
        >
          <div className="inline-flex justify-start items-center gap-0.5">
            <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
              What product or service do you sell?
            </div>
          </div>
          <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Briefly describe the main product or service your company offers.
          </div>
        </div>
        <div
          data-destructive="False"
          data-help-icon="false"
          data-hint-text="false"
          data-label="false"
          data-size="sm"
          data-state="Placeholder"
          data-type="Default"
          className="flex-1 inline-flex flex-col justify-start items-start gap-1.5"
        >
          <input
            type="text"
            value={productService}
            onChange={(e) => setProductService(e.target.value)}
            placeholder="Describe product/service"
            className="self-stretch h-9 px-3 py-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 text-gray-900"
          />
        </div>
      </div>
      {/* row 2 */}
      <div className="self-stretch py-1 inline-flex justify-start items-start gap-8 flex-wrap content-start">
        <div
          data-actions="False"
          data-help-icon="false"
          data-size="sm"
          data-supporting-text="true"
          className="w-80 max-w-80 min-w-48 inline-flex flex-col justify-start items-start"
        >
          <div className="self-stretch inline-flex justify-start items-center gap-0.5">
            <div className="flex-1 justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
              Why should the choose your company over your competitors?
            </div>
          </div>
          <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            What makes your offering unique? Highlight your competitive advantages.
          </div>
        </div>
        <div
          data-destructive="False"
          data-hint-text="false"
          data-label="false"
          data-resize-handle="true"
          data-state="Placeholder"
          data-type="Default"
          {...{'data-↳-help-icon': 'true'}}
          className="flex-1 inline-flex flex-col justify-start items-start gap-1.5"
        >
          <textarea
            value={whyChoose}
            onChange={(e) => setWhyChoose(e.target.value)}
            placeholder="Explain why"
            className="self-stretch h-40 px-3.5 py-3 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 resize-y overflow-visible pr-2 text-gray-900"
          />
        </div>
      </div>
      {/* row 3 */}
      <div className="self-stretch py-1 inline-flex justify-start items-start gap-8 flex-wrap content-start">
        <div
          data-actions="False"
          data-hint-text="false"
          data-label="false"
          data-resize-handle="true"
          data-state="Placeholder"
          data-type="Default"
          {...{'data-↳-help-icon': 'true'}}
          className="w-80 max-w-80 min-w-48 inline-flex flex-col justify-start items-start"
        >
          <div className="self-stretch inline-flex justify-start items-center gap-0.5">
            <div className="flex-1 justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
              Can you tell me some success stories of companies you have worked with?
            </div>
          </div>
          <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
            Share a few examples of successful client outcomes or testimonials.
          </div>
        </div>
        <div
          data-destructive="False"
          data-hint-text="false"
          data-label="false"
          data-resize-handle="true"
          data-state="Placeholder"
          data-type="Default"
          {...{'data-↳-help-icon': 'true'}}
          className="flex-1 inline-flex flex-col justify-start items-start gap-1.5"
        >
          <textarea
            value={successStories}
            onChange={(e) => setSuccessStories(e.target.value)}
            placeholder="Describe successes"
            className="self-stretch h-40 px-3.5 py-3 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 resize-y overflow-visible pr-2 text-gray-900"
          />
        </div>
      </div>
      {/* divider + buttons */}
      {message && (
        <div className={`text-sm p-2 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message.text}
        </div>
      )}
      <div className="self-stretch flex flex-col justify-start items-center gap-5">
        <div className="self-stretch h-px bg-gray-200" />
        <div className="self-stretch inline-flex justify-end items-center gap-5">
          <button type="button" onClick={handleReset} className="flex justify-center items-center gap-1.5 overflow-hidden">
            <div className="justify-start text-gray-600 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
              Reset to default
            </div>
          </button>
          <div className="flex-1 flex justify-end items-center gap-3">
            <button type="button" onClick={handleReset} className="px-3.5 py-2.5 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-1 outline-offset-[-1px] outline-zinc-300 flex justify-center items-center gap-1 overflow-hidden">
              <div className="px-0.5 flex justify-center items-center">
                <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                  Cancel
                </div>
              </div>
            </button>
            <button type="submit" disabled={loading} className="px-3.5 py-2.5 bg-blue-700 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 flex justify-center items-center gap-1 overflow-hidden disabled:opacity-50">
              <div className="px-0.5 flex justify-center items-center">
                <div className="justify-start text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                  {loading ? "Saving..." : "Save changes"}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
