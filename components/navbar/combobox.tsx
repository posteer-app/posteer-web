"use client"

import * as React from "react"
import { CheckIcon, ChevronsUpDownIcon, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ComboboxProps {
  businesses?: {
    value: string,
    label: string
  }[]
}

export function Combobox({ businesses }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`justify-between ${!value ? "text-muted-foreground": ""}`}
        >
          {value
            ? businesses?.find((business) => business.value === value)?.label
            : "select business"}
          <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="find business..." />
          <CommandList>
            <CommandEmpty>no business found</CommandEmpty>
            <CommandGroup>
              {businesses?.map((business) => (
                <CommandItem
                  key={business.value}
                  value={business.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === business.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {business.label}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />

            <CommandGroup>
              <CommandItem
                value="new"
                onSelect={() => {
                  // handle create-new flow
                  console.log("create new business");
                  setOpen(false);
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                new business
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}