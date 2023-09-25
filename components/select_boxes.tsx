import { Select, SelectItem, Selection, Input } from "@nextui-org/react";
import { round } from "@/lib/units";
import { tillage } from "@/lib/model";

export function CropSelect(props: {
  updater: any;
  rotation: number;
  value: string;
}) {
  const crops = ["corn", "soybean", "wheat", "oats", "silage", "switchgrass"];

  function updater(key: Selection) {
    props.updater(props.rotation, key);
  }

  return (
    <Select
      className="w-32"
      aria-label="Crop Name"
      defaultSelectedKeys={[props.value]}
      onSelectionChange={updater}
    >
      {crops.map((item) => (
        <SelectItem key={item} value={item}>
          {item}
        </SelectItem>
      ))}
    </Select>
  );
}

export function TillageSelect(props: {
  updater: any;
  rotation: number;
  value: string;
}) {
  const tillage = ["conventional", "reduced", "no-till"] as tillage[];

  function updater(key: Selection) {
    props.updater(props.rotation, key);
  }

  return (
    <Select
      className="w-36"
      aria-label="Tillage"
      defaultSelectedKeys={[props.value]}
      onSelectionChange={updater}
    >
      {tillage.map((item: tillage) => (
        <SelectItem key={item} value={item}>
          {item}
        </SelectItem>
      ))}
    </Select>
  );
}

function parse(value: string) {
  let my_value = parseFloat(value);
  if (isNaN(my_value)) {
    my_value = 0;
  }
  return my_value;
}

export function RotationInput(props: {
  updater: any;
  rotation: number;
  value: string;
  unit_system: string;
}) {
  function updater(value: string) {
    props.updater(props.rotation, value);
  }

  const my_value = round(parse(props.value), 2);
  return (
    <Input
      className=""
      type="number"
      value={my_value.toString()}
      min={0}
      max={10000}
      onValueChange={(value) => props.updater(props.rotation, value)}
    >
      {" "}
    </Input>
  );
}
