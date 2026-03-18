import { Clock, AlertTriangle } from "lucide-react";

export default function TimeBanner({ isExpired, formatRemaining }) {
  if (isExpired) {
    return (
      <div className="bg-red-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Resume submission time has expired.</p>
            <p className="text-sm text-red-100">
              The 20-minute access window has closed. Contact admin to reset.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // return (
  //   <div className="bg-amber-50 border-b border-amber-200 py-2 px-4">
  //     <div className="max-w-7xl mx-auto flex items-center gap-2 text-amber-800 text-sm">
  //       <Clock className="w-4 h-4" />
  //       <span>
  //         Form access closes in{" "}
  //         <span className="font-bold font-mono">{formatRemaining()}</span>
  //       </span>
  //     </div>
  //   </div>
  // );
}
