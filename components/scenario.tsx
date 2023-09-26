import { unit_system_type } from "@/lib/model";
import RotationTable from "./rotation_table";

export default function Scenario(props: {
  className: string;
  state: string;
  county_name: string;
  crop_name_updater: any;
  crop_yield_updater: any;
  tillage_updater: any;
  nitrogen_updater: any;
  add_rotation: any;
  delete_rotation: any;
  scenario: any;
  unit_system: unit_system_type;
}) {
  function updateCropName(rotation: number, key: string) {
    props.crop_name_updater(props.scenario.id, rotation, key);
  }

  function updateCropYield(rotation: number, value: string) {
    props.crop_yield_updater(props.scenario.id, rotation, value);
  }

  function updateTileage(rotation: number, key: string) {
    props.tillage_updater(props.scenario.id, rotation, key);
  }

  function updateNitrogen(rotation: number, value: string) {
    props.nitrogen_updater(props.scenario.id, rotation, value);
  }

  return (
    <RotationTable
      className={props.className}
      scenario={props.scenario}
      crop_name_updater={updateCropName}
      crop_yield_updater={updateCropYield}
      tillage_updater={updateTileage}
      nitrogen_updater={updateNitrogen}
      add_rotation={props.add_rotation}
      delete_rotation={props.delete_rotation}
      unit_system={props.unit_system}
    />
  );
}
