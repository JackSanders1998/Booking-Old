import React from "react"
import "./button.css"

interface ButtonProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * How large should the button be?
   */
  size?: "small" | "medium" | "large"
  /**
   * Button contents
   */
  label: string
  /**
   * Optional click handler
   */
  onClick?: () => void
}

/**
 *
 * @param classes
 * @returns
 */
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}

/**
 * Primary UI component for user interaction
 */
export const Button = ({
  primary = false,
  size = "medium",
  backgroundColor,
  label,
  ...props
}: ButtonProps) => {
  const mode = primary ? "storybook-button--primary" : "storybook-button--secondary"
  return (
    <button
      type="button"
      // className={["storybook-button", `storybook-button--${size}`, mode].join(" ")}
      className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      style={{ backgroundColor }}
      {...props}
    >
      {label}
    </button>
  )
}
