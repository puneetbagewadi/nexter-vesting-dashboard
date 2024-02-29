import React from "react";

const cls = (input) =>
  input
    .replace(/\s+/gm, " ")
    .split(" ")
    .filter((cond) => typeof cond === "string")
    .join(" ")
    .trim();

const classes = {
  base: "",
  disabled: "!bg-none !bg-zee-grey-v-250 !text-white",
  variant: {
    primary:
      "inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-zee-primary-hover hover:text-white bg-zee-primary",
  },
};

export default function Button({
  children,
  type = "button",
  className,
  variant = "primary",
  disabled = false,
  spanClasses = "",
  ...props
}) {
  return (
    <button
      disabled={disabled}
      type={type}
      className={cls(`
                ${classes.base}
                ${classes.variant[variant]}
                ${disabled && classes.disabled}
                ${className}
            `)}
      {...props}
    >
      {children}
    </button>
  );
}
export function PageButton({ children, className, ...rest }) {
  return (
    <button
      type="button"
      className={cls(
        "relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
