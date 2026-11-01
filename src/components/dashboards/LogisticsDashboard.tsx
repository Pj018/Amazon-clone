import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Compass,
  Zap,
  PackageCheck
} from 'lucide-react';

export const LogisticsDashboard: React.FC = () => {
  const { addToast } = useApp();
  const [selectedVan, setSelectedVan] = useState<string>('VAN-412');

  const liveDispatches = [
    { id: 'TBA849201948203', driver: 'Marco V.', van: 'VAN-412 (Electric Rivian)', destination: 'Seattle, WA 98101', stopsLeft: 8, eta: '18 mins', status: 'Out for Delivery' },
    { id: 'TBA938472918234', driver: 'Sarah T.', van: 'VAN-109 (Fleet Prime)', destination: 'Bellevue, WA 98004', stopsLeft: 0, eta: 'Delivered', status: 'Delivered' },
    { id: 'TBA481920194812', driver: 'Kenji S.', van: 'VAN-884 (Electric Rivian)', destination: 'Redmond, WA 98052', stopsLeft: 14, eta: '42 mins', status: 'Out for Delivery' },
    { id: 'TBA671029481920', driver: 'Elena R.', van: 'VAN-311 (Fleet Prime)', destination: 'Tacoma, WA 98402', stopsLeft: 22, eta: '1 hr 10 mins', status: 'In Transit' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#131921] text-white rounded-xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">
              amazon<span className="text-[#007185] dark:text-[#3db2c6]">logistics</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-[#007185]/20 text-[#3db2c6] text-[10px] font-bold border border-[#007185]/40">
              PRIME FLEET TELEMETRY
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Real-time GPS routing, Rivian electric delivery vehicle telemetry, and sortation hub dispatch
          </p>
        </div>

        <button
          onClick={() => addToast('info', 'Fulfillment fleet dispatch telemetry refreshed')}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition border border-slate-700 flex items-center gap-1.5 self-start md:self-auto"
        >
          <Navigation className="w-3.5 h-3.5 text-[#FF9900]" />
          <span>Refresh Fleet Telemetry</span>
        </button>
      </div>

      {/* Fleet Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-xs text-slate-500">Active Prime Vans on Road</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums font-mono">
            1,248
          </div>
          <div className="text-[11px] text-emerald-600 mt-0.5 flex items-center gap-1 font-semibold">
            <Zap className="w-3 h-3" /> 74% Zero-Emission Electric
          </div>
        </div>

        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-xs text-slate-500">Packages in Transit</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums font-mono">
            14,892
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Regional PNW fulfillment cluster
          </div>
        </div>

        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-xs text-slate-500">On-Time SLA Delivery</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums font-mono">
            99.6%
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Exceeding 99.0% commitment
          </div>
        </div>

        <div className="bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-4 shadow-xs">
          <div className="text-xs text-slate-500">Avg. Click-to-Doorstep</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1 tabular-nums font-mono">
            16.8 hrs
          </div>
          <div className="text-[11px] text-[#007185] dark:text-[#3db2c6] mt-0.5 font-bold">
            Prime 1-Day Standard
          </div>
        </div>
      </div>

      {/* Live Fleet Map & GPS Tracking Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Simulator Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#FF9900]" />
                Live GPS Delivery Route Simulation · Seattle Metro
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeting Delivery Address: 742 Evergreen Terrace (Alex Rivera)
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              Driver 8 Stops Away
            </span>
          </div>

          {/* Graphical Map Representation */}
          <div className="relative w-full h-64 bg-slate-100 dark:bg-[#12161b] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            {/* Street Grid SVG */}
            <svg className="w-full h-full opacity-60 dark:opacity-40" viewBox="0 0 500 250">
              <path d="M 0,50 L 500,50 M 0,100 L 500,100 M 0,150 L 500,150 M 0,200 L 500,200" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />
              <path d="M 60,0 L 60,250 M 140,0 L 140,250 M 220,0 L 220,250 M 300,0 L 300,250 M 380,0 L 380,250 M 460,0 L 460,250" stroke="currentColor" strokeWidth="1" className="text-slate-300 dark:text-slate-700" />
              {/* Route line */}
              <path d="M 80,180 Q 200,170 240,110 T 380,80" fill="none" stroke="#FF9900" strokeWidth="3" strokeDasharray="6 3" />
            </svg>

            {/* Warehouse Hub Marker */}
            <div className="absolute left-[14%] top-[68%] p-2 rounded-lg bg-[#131921] text-white border border-slate-700 shadow-md flex items-center gap-1.5 text-[10px]">
              <PackageCheck className="w-3.5 h-3.5 text-[#FF9900]" />
              <span>Seattle Hub B2</span>
            </div>

            {/* Delivery Van Position */}
            <div className="absolute left-[46%] top-[40%] flex flex-col items-center animate-bounce duration-1000">
              <div className="p-2 rounded-full bg-[#FF9900] text-slate-950 shadow-lg border-2 border-white">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded shadow mt-1 border">
                Van #412
              </span>
            </div>

            {/* Destination House Marker */}
            <div className="absolute right-[22%] top-[28%] p-2 rounded-lg bg-emerald-600 text-white shadow-md flex items-center gap-1.5 text-[10px] font-bold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Your Doorstep</span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-3">
            <span>Current Carrier: <strong>Amazon Prime Express Fleet #412</strong></span>
            <span>Speed: <strong>26 mph</strong> · ETA: <strong>18 mins</strong></span>
          </div>
        </div>

        {/* Live Dispatch Queue (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#181c1d] rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-[#FF9900]" />
              Live Courier Dispatch Board
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Active courier runs dispatched from regional sort centers
            </p>
          </div>

          <div className="space-y-3">
            {liveDispatches.map(disp => (
              <div
                key={disp.id}
                onClick={() => setSelectedVan(disp.van)}
                className={`p-3 rounded-lg border text-xs transition cursor-pointer ${
                  selectedVan === disp.van
                    ? 'border-[#FF9900] bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-[#FF9900]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span className="font-mono text-[#007185] dark:text-[#3db2c6]">{disp.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    disp.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}>
                    {disp.status}
                  </span>
                </div>
                <div className="text-slate-700 dark:text-slate-300 font-medium mt-1">
                  Driver: {disp.driver} · {disp.van}
                </div>
                <div className="text-slate-500 text-[11px] mt-0.5 flex items-center justify-between">
                  <span>To: {disp.destination}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {disp.stopsLeft > 0 ? `${disp.stopsLeft} stops left (${disp.eta})` : 'Delivered on time'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs text-slate-500 mt-4">
            Couriers use encrypted Amazon Delivery App with offline sync & doorstep photo verification.
          </div>
        </div>
      </div>
    </div>
  );
};
