import React from "react";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";

const PasswordField = React.forwardRef(
  (
    {
      id,
      autoComplete,
      placeholder,
      hasError,
      describedBy,
      toggleLabel = "password",
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const Icon = isVisible ? EyeOff : Eye;

    return (
      <div className="relative">
        <Input
          id={id}
          ref={ref}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="h-11 pr-12"
          aria-invalid={hasError}
          aria-describedby={describedBy}
          {...props}
        />
        <button
          type="button"
          tabIndex={0}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md p-0 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-slate-300 active:translate-y-[-50%]"
          aria-label={isVisible ? `Hide ${toggleLabel}` : `Show ${toggleLabel}`}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    );
  },
);

PasswordField.displayName = "PasswordField";

export default PasswordField;
