import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useState } from "react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
}) {

  const [stateOptions, setStateOptions] = useState({})

  function resolveOptions(name, options) {

    if (!stateOptions[name]) {
      setStateOptions({ ...stateOptions, [name]: options })
    }
  }

  const handleDropdownChange = (value, getControlItem) => {
    setFormData({
      ...formData,
      [getControlItem.name]: value,
    })

    if (getControlItem.populates) {

      const item = getControlItem.options.find((itm) => itm.name == value)

      if (item) {
        setStateOptions({ ...setStateOptions, [getControlItem.populates]: item["subcategories"] })

      }
    }

  }

  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const name = getControlItem.name;
    const value = formData[name]?.name || formData[name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={name}
            placeholder={getControlItem.placeholder}
            id={name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [name]: event.target.value,
              })
            }
          />
        );
        break;

      case "select":
        {
          if (getControlItem.options) {
            resolveOptions(name, getControlItem.options);
          }

          element = (
            <Select
              onValueChange={(val) => handleDropdownChange(val, getControlItem)}
              value={value}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={getControlItem.label} />
              </SelectTrigger>
              <SelectContent>
                {stateOptions[name]?.length > 0
                  ? stateOptions[name].map((optionItem) => {
                    const id = optionItem.id  || optionItem._id || optionItem.name || optionItem.label || optionItem
                    const selected = value ? String(value) == String(id) : false

                    return (
                      <SelectItem key={id} value={id} selected={selected}>
                        {optionItem.label || optionItem.name || optionItem}
                      </SelectItem>
                    )
                  })
                  : null}
              </SelectContent>
            </Select>
          );
          break;
        }

      case "textarea":
        element = (
          <Textarea
            name={name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [name]: event.target.value,
              })
            }
          />
        );
        break;

      default:
        element = (
          <Input
            name={name}
            placeholder={getControlItem.placeholder}
            id={name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [name]: event.target.value,
              })
            }
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button disabled={isBtnDisabled} type="submit" className="mt-2 w-full">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}

export default CommonForm;
