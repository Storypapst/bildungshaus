import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "ui-button inline-flex items-center justify-center border font-medium select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "ui-button-primary", outline: "ui-button-outline",
        secondary: "ui-button-secondary", ghost: "ui-button-ghost",
        destructive: "ui-button-destructive", link: "ui-button-link",
      },
      size: {
        default: "", xs: "", sm: "", lg: "",
        icon: "ui-button-icon", "icon-xs": "ui-button-icon",
        "icon-sm": "ui-button-icon", "icon-lg": "ui-button-icon",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
