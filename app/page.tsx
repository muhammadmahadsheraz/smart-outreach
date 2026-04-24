"use client";

import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="w-full bg-white font-sans">
      {/* Header/Navigation */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-8 h-20 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Image
              src="/images/logo.svg"
              alt="Margot"
              width={121}
              height={36}
            />
            <nav className="hidden md:flex gap-6">
              <a href="#products" className="text-gray-700 text-base font-semibold hover:text-blue-700 transition">Products</a>
              <a href="#services" className="text-gray-700 text-base font-semibold hover:text-blue-700 transition">Services</a>
              <a href="#pricing" className="text-gray-700 text-base font-semibold hover:text-blue-700 transition">Pricing</a>
              <a href="#resources" className="text-gray-700 text-base font-semibold hover:text-blue-700 transition">Resources</a>
              <a href="#about" className="text-gray-700 text-base font-semibold hover:text-blue-700 transition">About</a>
            </nav>
          </div>
          <Link href="/demo" className="px-4 py-3 bg-blue-700 text-white text-base font-semibold rounded-lg hover:bg-blue-800 transition">
            Agendar una demo
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 px-8">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <h1 className="text-5xl font-semibold text-blue-950 leading-tight">
                  Margot, la vendedora digital con AI.
                </h1>
                <p className="text-xl font-medium text-blue-950">
                  Busca clientes potenciales, redacta mensajes de ventas, y los contacta uno a uno en automático.
                </p>
              </div>
              
              <div className="flex gap-4 max-w-md">
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="flex-1 px-3.5 py-3 bg-white rounded-lg border border-gray-300 text-base placeholder-gray-500 shadow-sm"
                />
                <button className="px-4 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition">
                  Agendar
                </button>
              </div>
              <p className="text-sm text-blue-950">
                Agenda una demo gratuita para ver cuántos prospectos puedes conseguir.
              </p>
            </div>

            {/* Right - Dashboard Preview */}
            <div className="flex flex-col gap-6">
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <Image
                  src="/images/landing_page_image.png"
                  alt="Dashboard Preview"
                  width={800}
                  height={320}
                  className="w-full h-80 object-cover"
                />
              </div>
              
              {/* Notification Cards */}
              <div className="space-y-3">
                <div className="rounded-lg overflow-hidden border border-sky-200 backdrop-blur-sm">
                  <Image
                    src="/images/amazon_notification.png"
                    alt="Amazon notification"
                    width={600}
                    height={80}
                    className="w-full h-auto"
                  />
                </div>
                
                <div className="rounded-lg overflow-hidden border border-sky-200 backdrop-blur-sm opacity-75">
                  <Image
                    src="/images/google_notification.png"
                    alt="Google notification"
                    width={600}
                    height={80}
                    className="w-full h-auto"
                  />
                </div>

                <div className="rounded-lg overflow-hidden border border-sky-200 backdrop-blur-sm opacity-50">
                  <Image
                    src="/images/chatgpt_notification.png"
                    alt="ChatGPT notification"
                    width={600}
                    height={80}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white/20">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-col gap-8 items-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900 text-center">
              ¿Cómo funciona la vendedora digital Margot?
            </h2>
            <p className="text-xl text-gray-600 text-center max-w-3xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad.
            </p>
          </div>

          {/* Process Steps Grid */}
          <div className="grid grid-cols-3 gap-8">
            {/* Step 1: Prospect Research */}
            <div className="flex flex-col gap-5">
              <div className="bg-sky-100 p-4 rounded-lg space-y-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl">👤</div>
                <div>
                  <p className="text-xl font-semibold text-gray-900">John Doe</p>
                  <p className="text-sm text-gray-700">Sales Manager</p>
                  <p className="text-sm text-gray-700 underline">john.doe@amazon.com</p>
                </div>
                <div className="px-2 py-1.5 bg-white rounded-md inline-block text-sm text-gray-500">Lead</div>
              </div>

              <div className="flex gap-2">
                <div className="bg-white p-4 rounded-lg flex-1 border border-gray-200">
                  <p className="text-sm text-gray-700 font-semibold">Amazon</p>
                </div>
                <div className="bg-white p-4 rounded-lg flex-1 border border-gray-200">
                  <p className="text-sm text-gray-700 font-semibold">Seattle</p>
                  <p className="text-sm text-gray-600">USA</p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700">Website</p>
                <p className="text-lg font-semibold text-gray-900 underline">www.amazon.com</p>
              </div>
            </div>

            {/* Step 2: Message Generation */}
            <div className="flex flex-col gap-5">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Sending today</p>
                <p className="text-lg font-semibold text-gray-900 mb-4">Boost your sales with our solution.</p>
                <div className="space-y-2">
                  <div className="h-1.5 bg-gray-200 rounded w-56"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-44"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-52"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-48"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-52"></div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Sending today</p>
                <p className="text-lg font-semibold text-gray-900 mb-4">Optimize your sales strategies</p>
                <div className="space-y-2">
                  <div className="h-1.5 bg-gray-200 rounded w-56"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-44"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-52"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-48"></div>
                  <div className="h-1.5 bg-gray-200 rounded w-52"></div>
                </div>
              </div>
            </div>

            {/* Step 3: Automation */}
            <div className="flex flex-col gap-5">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Automation</p>
                <p className="text-lg font-semibold text-gray-900 mb-4">Campaign Setup</p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded flex-shrink-0 flex items-center justify-center text-white text-xs">✓</div>
                    <span className="text-gray-700">Your ideal customer</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded flex-shrink-0 flex items-center justify-center text-white text-xs">✓</div>
                    <span className="text-gray-700">Offer</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 rounded flex-shrink-0 flex items-center justify-center text-white text-xs">◐</div>
                    <span className="text-blue-700">Confirm messages</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-white border border-gray-300 rounded flex-shrink-0"></div>
                    <span className="text-gray-700">Automate</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center gap-5 p-6">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 text-center">Lorem ipsum dolor sit</h3>
              <p className="text-base text-gray-600 text-center">
                Busca y extrae información de clientes potenciales entre más de 40 millones de datos B2B de fuentes como LinkedIn, Google Maps, Instagram.
              </p>
            </div>

            <div className="flex flex-col items-center gap-5 p-6">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">✏️</div>
              <h3 className="text-xl font-semibold text-gray-900 text-center">Lorem ipsum dolor sit</h3>
              <p className="text-base text-gray-600 text-center">
                Redacta con IA mensajes de venta personalizados, entrenada para conseguir más de 2.000 reuniones de ventas a nuestros clientes.
              </p>
            </div>

            <div className="flex flex-col items-center gap-5 p-6">
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">📧</div>
              <h3 className="text-xl font-semibold text-gray-900 text-center">Lorem ipsum dolor sit</h3>
              <p className="text-base text-gray-600 text-center">
                Los contacta uno a uno por emails, solicitándole una llamada reunión o llamada de ventas, para que tu equipo solo tenga que acudir y cerrarla.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Automation Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <h2 className="text-4xl font-semibold text-gray-900 text-center mb-16">
            Consigue nuevos clientes para tu empresa cada mes en piloto automático.
          </h2>

          <div className="grid grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col">
              <div className="bg-sky-100 rounded-2xl h-96 flex items-center justify-center mb-4">
                <p className="text-gray-500">Setup Image</p>
              </div>
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-blue-950 text-center mb-2">Lorem ipsum</h3>
                <p className="text-base text-gray-600 text-center">Dale a Margot información general sobre tu empresa y tus servicios.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col">
              <div className="bg-sky-100 rounded-2xl h-96 flex items-center justify-center mb-4">
                <div className="bg-white rounded-xl p-5 w-72 max-h-80 overflow-hidden">
                  <p className="text-lg font-semibold text-gray-900 text-center mb-4">Potential clients</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-neutral-50 rounded-lg border border-gray-200">Company name</div>
                    <div className="p-3 bg-neutral-50 rounded-lg border border-gray-200">Company name</div>
                    <div className="p-3 bg-neutral-50 rounded-lg border border-gray-200 bg-blue-50">Company name</div>
                    <div className="p-3 bg-neutral-50 rounded-lg border border-gray-200">Company name</div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-blue-950 text-center mb-2">Lorem ipsum</h3>
                <p className="text-base text-gray-600 text-center">Margot encuentra clientes potenciales con el target que le has dicho.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col">
              <div className="bg-sky-100 rounded-2xl h-96 flex items-center justify-center mb-4">
                <div className="bg-white rounded-xl p-6 w-60">
                  <p className="font-semibold text-center mb-4">Your campaign</p>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs">✓</div>
                      <span>Your ideal customer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs">✓</div>
                      <span>Offer</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs">◐</div>
                      <span className="text-blue-700">Confirm messages</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                      <span>Automate</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-blue-950 text-center mb-2">Lorem ipsum</h3>
                <p className="text-base text-gray-600 text-center">Redactará una secuencia de ventas personalizada para cada destinatario.</p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col">
              <div className="bg-sky-100 rounded-2xl h-96 flex items-center justify-center mb-4">
                <div className="bg-white rounded-xl p-4 w-72">
                  <p className="text-lg font-semibold text-gray-900 text-center mb-4">Email sequence</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="font-semibold text-sm text-gray-900">Email 1: Email name</p>
                      <p className="text-xs text-gray-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <p className="font-semibold text-sm text-gray-900">Email 2: Email name</p>
                      <p className="text-xs text-gray-600 mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-blue-950 text-center mb-2">Lorem ipsum</h3>
                <p className="text-base text-gray-600 text-center">Envía mensajes uno a uno todos los días en piloto automático.</p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex flex-col">
              <div className="bg-sky-100 rounded-2xl h-96 flex items-center justify-center mb-4">
                <div className="bg-white rounded-xl p-4 w-72 text-sm">
                  <p className="font-semibold text-center mb-4">Reply email</p>
                  <div className="space-y-2 text-xs">
                    <p><strong>From:</strong> Lorem ipsum</p>
                    <hr />
                    <p><strong>To:</strong></p>
                    <hr />
                    <p><strong>Subject:</strong> Re: Lorem Ipsum</p>
                  </div>
                  <hr className="my-3" />
                  <p className="text-gray-600 text-xs mb-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-gray-100 rounded">↩️</button>
                      <button className="p-2 hover:bg-gray-100 rounded">↪️</button>
                    </div>
                    <button className="px-3 py-2 bg-blue-700 text-white rounded text-xs font-semibold">Send</button>
                  </div>
                </div>
              </div>
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-blue-950 text-center mb-2">Lorem ipsum</h3>
                <p className="text-base text-gray-600 text-center">Responde las objeciones y dudas de los prospectos, pulsando un botón. Margot se encarga de redactar el mensaje.</p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="flex flex-col">
              <div className="bg-sky-100 rounded-2xl h-96 flex items-center justify-center mb-4">
                <div className="bg-white rounded-xl p-4 w-72">
                  <p className="text-lg font-semibold text-gray-900 text-center mb-4">Companies</p>
                  <div className="space-y-2">
                    <div className="p-3 bg-neutral-50 rounded-lg border border-gray-200 flex items-center gap-2">
                      <input type="checkbox" checked className="w-4 h-4" />
                      <span className="text-sm text-gray-900">Company name</span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg border border-gray-200 flex items-center gap-2">
                      <input type="checkbox" checked className="w-4 h-4" />
                      <span className="text-sm text-gray-900">Company name</span>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-lg border border-gray-200 flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      <span className="text-sm text-gray-900">Company name</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-blue-950 text-center mb-2">Lorem ipsum</h3>
                <p className="text-base text-gray-600 text-center">Agenda la reunión o llamada, y solo acude a cerrar la venta.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Mobile */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="bg-blue-700 rounded-3xl p-16 flex gap-8 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-semibold text-white mb-6">
                Agenda una demo gratuita para ver cuántos prospectos puedes conseguir.
              </h2>
              <p className="text-xl text-neutral-100 mb-12">
                ¿Por qué las empresas B2B eligen Margot para aumentar sus ventas?
              </p>
              <button className="px-4 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-gray-100 transition">
                Agendar demo
              </button>
            </div>
            
            {/* Mobile Mockup Placeholder */}
            <div className="flex-1 flex justify-center">
              <div className="bg-gray-200 rounded-3xl w-80 h-96 flex items-center justify-center border-8 border-gray-900">
                <p className="text-gray-600">Mobile App Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <h2 className="text-4xl font-semibold text-gray-900 text-center mb-16">
            ¿Por qué las empresas B2B eligen Margot para aumentar sus ventas?
          </h2>

          <div className="grid grid-cols-3 gap-8">
            {/* Left Features */}
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">📊</div>
                <h3 className="text-xl font-bold text-gray-900">Lorem ipsum dolor sit amet</h3>
                <p className="text-base font-medium text-gray-600">Base de datos de +40 millones de prospectos.</p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">🎯</div>
                <h3 className="text-xl font-bold text-gray-900">Lorem ipsum dolor sit amet</h3>
                <p className="text-base font-medium text-gray-600">Adaptado y entrenado a tu empresa y a tu servicio.</p>
              </div>
            </div>

            {/* Center - Chart/Stats */}
            <div className="flex flex-col items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg p-8 w-full">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Oportunidades de negocio encontradas por Margot</h3>
                  <span className="text-lg font-semibold text-emerald-600">+104%</span>
                </div>
                <div className="flex gap-3 mb-6">
                  <button className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm font-semibold text-gray-700">12 meses</button>
                  <button className="flex-1 px-3 py-2 text-sm font-semibold text-gray-500">30 días</button>
                  <button className="flex-1 px-3 py-2 text-sm font-semibold text-gray-500">7 días</button>
                </div>
                <div className="h-48 bg-gray-100 rounded-lg flex items-end justify-center gap-1 p-4">
                  {[20, 14, 3, 20, 24, 12, 16, 20, 28, 36, 2, 2, 16, 6, 4, 6, 2, 44, 2, 20, 16, 8, 36, 14, 14, 32, 5, 24, 28, 12, 20, 28, 28, 20, 28, 32, 36, 9, 9, 36, 36, 36, 44, 5, 16, 36, 16, 11, 36, 8, 3, 6].map((h, i) => (
                    <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${(h / 44) * 100}%` }}></div>
                  ))}
                </div>
              </div>

              {/* Donut Chart */}
              <div className="absolute mt-64 flex flex-col items-center">
                <div className="relative w-48 h-48 rounded-full flex items-center justify-center">
                  <div className="absolute w-48 h-48 rounded-full border-8 border-blue-500"></div>
                  <div className="absolute w-40 h-40 rounded-full border-8 border-blue-600"></div>
                  <div className="absolute w-32 h-32 rounded-full border-8 border-blue-700"></div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600">Active campaigns</p>
                    <p className="text-2xl font-semibold text-gray-900">320</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Features */}
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">✏️</div>
                <h3 className="text-xl font-bold text-gray-900">Lorem ipsum dolor sit amet</h3>
                <p className="text-base font-medium text-gray-600">Mensajes personalizados para cada destinatario de vendedor expertos.</p>
              </div>

              <div className="flex flex-col gap-5">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">💰</div>
                <h3 className="text-xl font-bold text-gray-900">Lorem ipsum dolor sit amet</h3>
                <p className="text-base font-medium text-gray-600">Ahorro de un 75% frente a vendedores tradicionales.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-col items-center gap-12">
            <blockquote className="text-5xl font-semibold text-gray-900 text-center">
              Lorem ipsum dolor sit amet consectetur, lorem ipsum dolor sit amet consectetur.
            </blockquote>

            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">User Name</p>
                <p className="text-base text-gray-600">Position, Company</p>
              </div>
              
              {/* Pagination Dots */}
              <div className="flex gap-4">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
              </div>
            </div>

            {/* Company Logos */}
            <div className="flex flex-wrap gap-8 justify-center items-center mt-8">
              <div className="text-gray-900 font-semibold">3Portals</div>
              <div className="text-gray-900 font-semibold">Warpspeed</div>
              <div className="text-gray-900 font-semibold">GlobalBank</div>
              <div className="text-gray-900 font-semibold">Ikigai Labs</div>
              <div className="text-gray-900 font-semibold">Eightball</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1440px] mx-auto px-8">
          <h2 className="text-4xl font-semibold text-gray-900 text-center mb-16">
            Preguntas frecuentes
          </h2>

          <div className="max-w-2xl mx-auto space-y-4">
            <div className="bg-sky-100 p-8 rounded-2xl">
              <div className="flex gap-6 items-start">
                <div className="w-6 h-6 mt-1 flex-shrink-0">📋</div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Is there a free trial available?</h3>
                  <p className="text-base text-gray-600">Yes, you can try us for free for 30 days. If you want, we'll provide you with a free, personalized 30-minute onboarding call to get you up and running as soon as possible.</p>
                </div>
              </div>
            </div>

            {[
              "Can I change my plan later?",
              "What is your cancellation policy?",
              "Can other info be added to an invoice?",
              "How does billing work?",
              "How do I change my account email?"
            ].map((question) => (
              <div key={question} className="bg-white p-8 rounded-2xl border border-gray-200">
                <div className="flex gap-6 items-start">
                  <div className="w-6 h-6 mt-1 flex-shrink-0">📋</div>
                  <h3 className="text-lg font-medium text-gray-900">{question}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white pt-16 pb-12 border-t border-gray-200">
        <div className="max-w-[1440px] mx-auto px-8">
          <div className="flex flex-col items-center gap-8 mb-12">
            <Image
              src="/images/logo.svg"
              alt="Margot"
              width={121}
              height={36}
            />
            <nav className="flex gap-8 text-base font-semibold text-gray-700">
              <a href="#" className="hover:text-blue-700 transition">Overview</a>
              <a href="#" className="hover:text-blue-700 transition">Features</a>
              <a href="#" className="hover:text-blue-700 transition">Pricing</a>
              <a href="#" className="hover:text-blue-700 transition">Careers</a>
              <a href="#" className="hover:text-blue-700 transition">Help</a>
              <a href="#" className="hover:text-blue-700 transition">Privacy</a>
            </nav>
          </div>

          <div className="border-t border-gray-200 pt-8 flex justify-between items-center">
            <p className="text-base text-gray-500">© 2024 Ateni. All rights reserved.</p>
            <div className="flex gap-4 text-base text-gray-500">
              <a href="#" className="hover:text-gray-900 transition">Terms</a>
              <a href="#" className="hover:text-gray-900 transition">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}