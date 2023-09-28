"use client";
import { useImmer } from "use-immer";
import { useState } from "react";
import { data_info, tillage, crop, scenario_info } from "@/lib/model";
import { stringToUnitSystemType } from "@/lib/units";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import Scenario from "./scenario";
import { RadioGroup, Radio } from "@nextui-org/react";
import { socrates } from "@/lib/socrates";
import CountyParameters from "./county_parameters";
import ResultTable from "./result_table";
import {
  scenario_to_metric,
  scenario_to_imperial,
  rotations_to_metric,
  county_to_metric,
  f_to_c,
  c_to_f,
  mm_to_inch,
  inch_to_mm,
  round,
} from "@/lib/units";
import ResultChart from "./result_chart";
import { title } from "process";

function normalize(value: string) {
  let my_value = parseFloat(value);
  if (isNaN(my_value)) {
    my_value = 0;
  }
  if (my_value < 0) {
    my_value = 0;
  }
  return my_value;
}

export default function CountyModel(props: {
  my_state: string;
  county_name: string;
  default_yields: any;
  initial_model: data_info;
}) {
  const [scenarios, setScenarios] = useImmer(props.initial_model.scenarios);
  const [county, setCounty] = useImmer(props.initial_model.county);
  const [unit_system, setUnitSystem] = useState("imperial");

  const results = scenarios.map((scenario, index) => {
    let current_rotations = rotations_to_metric(
      scenario.rotations,
      stringToUnitSystemType(unit_system)
    );
    let current_county = county_to_metric(
      county,
      stringToUnitSystemType(unit_system)
    );
    let result = socrates(current_rotations, current_county, scenario.title, 1);
    return result;
  });

  function updateCropName(
    scenario_id: number,
    rotation: number,
    value: Selection
  ) {
    setScenarios((draft) => {
      const index = draft.findIndex((scenario) => scenario.id === scenario_id);
      const current_scenario = draft[index];
      const current_rotation = current_scenario.rotations[rotation];
      // @ts-ignore
      current_rotation.crop_name = value.currentKey;
      // @ts-ignore
      current_rotation.crop_yield = props.default_yields[value.currentKey] || 0;
    });
  }

  function updateCropYield(
    scenario_id: number,
    rotation: number,
    value: string
  ) {
    let crop_yield = normalize(value);
    setScenarios((draft) => {
      const index = draft.findIndex((scenario) => scenario.id === scenario_id);
      const current_scenario = draft[index];
      const current_rotation = current_scenario.rotations[rotation];
      current_rotation.crop_yield = crop_yield;
    });
  }

  function updateTileage(
    scenario_id: number,
    rotation: number,
    value: tillage
  ) {
    setScenarios((draft) => {
      const index = draft.findIndex((scenario) => scenario.id === scenario_id);
      const current_scenario = draft[index];
      const current_rotation = current_scenario.rotations[rotation];
      // @ts-ignore
      current_rotation.tillage = value.currentKey;
    });
  }

  function updateNitrogen(
    scenario_id: number,
    rotation: number,
    value: string
  ) {
    let nitrogen = normalize(value);

    setScenarios((draft) => {
      const index = draft.findIndex((scenario) => scenario.id === scenario_id);
      const current_scenario = draft[index];
      const current_rotation = current_scenario.rotations[rotation];
      current_rotation.nitrogen = nitrogen;
    });
  }

  function addRotation(scenario_id: number) {
    setScenarios((draft) => {
      const index = draft.findIndex((scenario) => scenario.id === scenario_id);
      const current_scenario = draft[index];
      current_scenario.rotations.push({
        year: current_scenario.rotations.length,
        crop_name: "corn",
        crop_yield: 148,
        tillage: "conventional",
        nitrogen: 142,
      });
    });
  }

  function addScenario() {
    setScenarios((draft) => {
      let rotations = draft[0].rotations;
      let new_scenario: scenario_info = {
        title: "Scenario " + draft.length,
        id: draft.length,
        color: getRandomColor(),
        rotations: rotations,
      };

      draft.push(new_scenario);
    });
  }

  function county_updater(variable: string, value: string) {
    switch (variable) {
      case "precipitation":
        setCounty((draft) => {
          let precip = normalize(value);
          draft.precipitation = round(precip, 2);
          if (draft.precipitation < 0) {
            draft.precipitation = 0;
          }
        });
        break;
      case "t_max":
        setCounty((draft) => {
          let t_max = normalize(value);
          draft.t_max = round(t_max, 1);
          if (draft.t_max < draft.t_min) {
            draft.t_min = draft.t_max;
          }
        });
        break;
      case "t_min":
        setCounty((draft) => {
          let t_min = normalize(value);
          draft.t_min = round(t_min, 1);
          if (draft.t_min > draft.t_max) {
            draft.t_max = draft.t_min;
          }
        });
        break;
      case "c_zero":
        setCounty((draft) => {
          draft.c_zero = normalize(value);
        });
        break;
      case "bulk_density":
        setCounty((draft) => {
          draft.bulk_density = normalize(value);
        });
        break;
      case "clay":
        setCounty((draft) => {
          draft.clay = normalize(value);
          if (draft.clay > 100) {
            draft.clay = 100;
          }
        });
        break;
    }
  }

  function handle_unit_system_change(value: string) {
    setUnitSystem(value);
    update_rotations_to_unit_system(value);
    update_county_to_unit_system(value);
  }

  function update_rotations_to_unit_system(unit_system: string) {
    switch (unit_system) {
      case "imperial":
        setScenarios((draft) => {
          draft.forEach((scenario) => {
            scenario_to_imperial(scenario);
          });
        });
        break;
      case "metric":
        setScenarios((draft) => {
          draft.forEach((scenario) => {
            scenario_to_metric(scenario);
          });
        });
        break;
    }
  }

  function update_county_to_unit_system(unit_system: string) {
    switch (unit_system) {
      case "imperial":
        setCounty((draft) => {
          draft.precipitation = round(mm_to_inch(draft.precipitation), 1);
          draft.t_max = round(c_to_f(draft.t_max), 1);
          draft.t_min = round(c_to_f(draft.t_min), 1);
        });
        break;
      case "metric":
        setCounty((draft) => {
          draft.precipitation = round(inch_to_mm(draft.precipitation), 1);
          draft.t_max = round(f_to_c(draft.t_max), 1);
          draft.t_min = round(f_to_c(draft.t_min), 1);
        });
        break;
    }
  }

  function delete_rotation(scenario_id: number, rotation: number) {
    setScenarios((draft) => {
      let index = draft.findIndex((scenario) => scenario.id === scenario_id);
      const current_scenario = draft[index];
      current_scenario.rotations.splice(rotation, 1);
      if (current_scenario.rotations.length === 0) {
        draft.splice(index, 1);
      }
    });
  }

  function getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  let colors = scenarios.map((scenario) => scenario.color);
  let units = stringToUnitSystemType(unit_system);

  return (
    <div>
      <section className="p-4">
        <div className="flex flex-row-reverse gap-5 ">
          <>
            <Button onPress={onOpen} color="secondary">
              Instructions
            </Button>
            <Modal isOpen={isOpen} size="3xl" onOpenChange={onOpenChange}>
              <ModalContent className="w-full">
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 font-capital">
                      Instructions
                    </ModalHeader>
                    <ModalBody>
                      <h2 className="font-bold">
                        Calculate the greenhouse gas impact of different farming
                        systems
                      </h2>
                      <p className="text-sm">
                        The base scenario is a two year corn-soybean rotation.
                        The default settings for that rotation and for the
                        environmental conditions are averages for the county you
                        chose from the clickable map. If desired, you may adjust
                        some or all of the default settings to more accurately
                        represent the cropping system and area you are
                        interested in.
                      </p>
                      <ul className="list-disc px-16 text-sm">
                        <li>
                          Chose to have the data presented in either Metric or
                          Imperial units by clicking the appropriate button at
                          the bottom of the page.
                        </li>
                        <li>
                          Adjust some or all of the default baseline scenario
                          settings for:
                          <ul className="list-disc px-16">
                            <li>Crop (use drop down arrows)</li>
                            <li>Yield (enter new number)</li>
                            <li>Tillage (use drop down arrow)</li>
                            <li>Fertilizer (enter new number)</li>
                            <li>Environmental Conditions (enter new data)</li>
                          </ul>
                        </li>
                        <li>
                          If needed, &quot;Remove&quot; or &quot;Add another
                          year to the rotation&quot; by clicking the appropriate
                          buttons and then changing the default settings as
                          desired.
                        </li>
                        <li>
                          The greenhouse gas cost is represented in a graph (top
                          of page) and in a table (right side of the page).
                          Click on the &quot;i&quot; to learn about what the
                          data means.
                        </li>
                      </ul>
                      <h2 className="font-bold">
                        How do other cropping systems compare to this cropland?
                      </h2>
                      <p className="text-sm">
                        The graph you created above is the &quot;base
                        scenario&quot;. To compare one or more cropping systems
                        to the &quot;base scenario&quot;:
                      </p>
                      <ul className="list-disc px-16 text-sm">
                        <li>
                          Click &quot;Add scenario&quot; and a new scenario will
                          appear below the &quot;base scenario&quot;.
                        </li>
                        <li>
                          Adjust the default settings and delete/add years to
                          the rotation as desired.
                        </li>
                      </ul>
                      <p className="text-sm">
                        The number next to each graph is the greenhouse gas cost
                        difference between that scenario and the &quot;base
                        scenario&quot;. A green (negative) number means that the
                        new cropping scenario is better for the environment than
                        the base scenario: it has a lower greenhouse gas cost. A
                        red (positive) number means the new cropping scenario
                        has a higher greenhouse gas cost (worse for the
                        environment)
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onPress={onClose}>
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
          <RadioGroup
            className="p-2"
            label="Select your unit system"
            color="secondary"
            orientation="horizontal"
            onValueChange={handle_unit_system_change}
            defaultValue={unit_system}
          >
            <Radio value="imperial">imperial</Radio>
            <Radio value="metric">metric</Radio>
          </RadioGroup>
        </div>
        <div className="flex flex-row flex-wrap">
          <div>
            <CountyParameters
              county={county}
              unit_system={units}
              updater={county_updater}
            />
          </div>
          <div className="w-1/2">
            <ResultChart
              results={results}
              unit_system={units}
              colors={colors}
            />
          </div>
        </div>
        {scenarios.map((scenario, index) => {
          return (
            <div className="flex flex-wrap gap-2" key={`scenario-${index}`}>
              <Scenario
                className="mt-4"
                state={props.my_state}
                county_name={props.county_name}
                scenario={scenario}
                unit_system={stringToUnitSystemType(unit_system)}
                crop_name_updater={updateCropName}
                crop_yield_updater={updateCropYield}
                tillage_updater={updateTileage}
                nitrogen_updater={updateNitrogen}
                add_rotation={addRotation}
                delete_rotation={delete_rotation}
              />
              <ResultTable
                results={results[index].results}
                unit_system={units}
              />
            </div>
          );
        })}
        <Button onClick={addScenario} className="mt-8 ml-4" color="secondary">
          Add a Scenario
        </Button>
      </section>
    </div>
  );
}
