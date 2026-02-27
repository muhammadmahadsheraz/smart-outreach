"use client";
import React from "react";
import Image from "next/image";

interface CompanyDetailsProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export default function CompanyDetails(props: CompanyDetailsProps) {
  const { className = "", ...rest } = props;

  const [companyName, setCompanyName] = React.useState("");
  const [companyWebsite, setCompanyWebsite] = React.useState("");
  const [companyDescription, setCompanyDescription] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ companyName, companyWebsite, companyDescription, file });
  };
 
  const handleReset = () => {
    setCompanyName("");
    setCompanyWebsite("");
    setCompanyDescription("");
    setFile(null);
  };
  return (
    <form
      onSubmit={handleSubmit}
      {...rest}
      className={`self-stretch inline-flex flex-col justify-start items-start gap-6 ${className}`.trim()}
    >
      <div className="self-stretch flex-1 flex flex-col justify-between items-start">
        <div className="self-stretch flex-1 flex flex-col justify-start items-start gap-5 pb-12">
          {/* row 1 */}
          <div className="self-stretch py-1 inline-flex justify-start items-start gap-8 flex-wrap content-start">
            <div
              {...{
                // original design had a weird data attribute “data-↳-required-*”
                // which cannot be used directly in JSX; spread to preserve it.
                'data-↳-required-*': 'false',
              }}
              data-actions="False"
              data-help-icon="false"
              data-size="sm"
              data-supporting-text="true"
              className="flex-1 max-w-80 min-w-48 inline-flex flex-col justify-start items-start"
            >
              <div className="inline-flex justify-start items-center gap-0.5">
                <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                  Your company name
                </div>
              </div>
              <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                Lorem ipsum dolor sit amet.
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
              <div className="self-stretch flex flex-col justify-start items-start gap-1.5">
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="self-stretch h-9 px-3 py-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300"
                />
              </div>
            </div>
          </div>
          {/* row 2 */}
          <div className="self-stretch py-1 inline-flex justify-start items-start gap-8 flex-wrap content-start">
            <div
              data-actions="False"
              data-help-icon="false"
              data-size="sm"
              data-supporting-text="true"
              className="flex-1 max-w-80 min-w-48 inline-flex flex-col justify-start items-start"
            >
              <div className="inline-flex justify-start items-center gap-0.5">
                <div className="justify-start text-gray-700 text-sm font-semibold font-['Inter'] leading-5">
                  Your company’s website
                </div>
              </div>
              <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Inter'] leading-5">
                Lorem ipsum dolor sit amet.
              </div>
            </div>
            <div className="flex-1 inline-flex flex-col justify-start items-start gap-1.5">
                <input
                  type="url"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="self-stretch h-9 px-3 py-2 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300"
                />
              </div>
          </div>
          {/* row 3 */}
          <div className="self-stretch py-1 inline-flex justify-start items-start gap-8 flex-wrap content-start">
            <div
              data-actions="False"
              data-help-icon="false"
              data-size="sm"
              data-supporting-text="true"
              className="flex-1 max-w-80 min-w-48 inline-flex flex-col justify-start items-start"
            >
              <div className="inline-flex justify-start items-center gap-0.5">
                <div className="justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                  What does your company do?
                </div>
              </div>
              <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                Lorem ipsum dolor sit amet.
              </div>
            </div>
            <textarea
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="Describe your company"
              className="flex-1 h-24 px-3.5 py-3 bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] outline outline-1 outline-offset-[-1px] outline-zinc-300 resize-y overflow-visible pr-2"
            />
          </div>
          {/* row 4 */}
          <div className="self-stretch py-1 inline-flex justify-start items-start gap-8 flex-wrap content-start">
            <div
              data-actions="False"
              data-help-icon="false"
              data-required="false"
              data-size="sm"
              data-supporting-text="true"
              className="flex-1 max-w-80 min-w-48 inline-flex flex-col justify-start items-start"
            >
              <div className="self-stretch inline-flex justify-start items-center gap-0.5">
                <div className="flex-1 justify-start text-gray-700 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                  Do you have any presentation or brochure of your company to know more about it?
                </div>
              </div>
              <div className="self-stretch justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                Lorem ipsum dolor sit amet.
              </div>
            </div>
            <div className="flex-1 h-24 inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch relative flex-1 px-6 py-4 bg-white rounded-xl outline outline-1 outline-offset-[-1px] outline-zinc-300 flex flex-col justify-start items-center gap-1">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <div className="self-stretch flex-1 inline-flex justify-center items-center gap-3">
                  <div className="w-10 h-10 relative bg-white rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-1 outline-offset-[-1px] outline-gray-200 overflow-hidden">
                    <div className="w-5 h-5 left-[10px] top-[10px] absolute overflow-hidden">
                      <Image src = "/MargotTraining/upload-icon.svg" alt = "icon" width = {20} height= {20} className="w-4 h-3.5 left-[2.5px] top-[2.50px] absolute" />
                    </div>
                  </div>
                  <div className="inline-flex flex-col justify-start items-center gap-1">
                    <div className="self-stretch inline-flex justify-center items-start gap-1">
                      <div className="flex justify-center items-center gap-1.5 overflow-hidden">
                        <div className="justify-start text-blue-800 text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                          Click to upload
                        </div>
                      </div>
                      <div className="justify-start text-gray-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-5">
                        or drag and drop
                      </div>
                    </div>
                    <div className="self-stretch text-center justify-start text-gray-600 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-4">
                      PDF, WORD , PNG, JPG (max. 800x400px)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {file && (
          <div className="text-sm text-gray-700 mt-2">Selected file: {file.name}</div>
        )}
        {/* divider + buttons */}
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
              <button type="submit" className="px-3.5 py-2.5 bg-blue-700 rounded-lg shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] shadow-[inset_0px_-2px_0px_0px_rgba(10,13,18,0.05)] shadow-[inset_0px_0px_0px_1px_rgba(10,13,18,0.18)] outline outline-2 outline-offset-[-2px] outline-white/10 flex justify-center items-center gap-1 overflow-hidden">
                <div className="px-0.5 flex justify-center items-center">
                  <div className="justify-start text-white text-sm font-semibold font-['Plus_Jakarta_Sans'] leading-5">
                    Save changes
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
