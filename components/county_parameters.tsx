import { County, unit_system_type } from "@/lib/model";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Link,
  Tooltip,
} from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import StyledTooltip from "../components/styled_tooltip";

const stateAbbreviationsToNames = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

function temperature_units_in_system(system: unit_system_type) {
  return system === "metric" ? "C" : "F";
}
function precipitation_units_in_system(system: unit_system_type) {
  return system === "metric" ? "mm" : "in";
}

export default function CountyParameters(props: {
  county: County;
  unit_system: unit_system_type;
  updater: any;
}) {
  const state_name =
    stateAbbreviationsToNames[
      props.county.state as keyof typeof stateAbbreviationsToNames
    ];
  const county_link = `https://en.wikipedia.org/wiki/${props.county.name}_County,_${state_name}`;

  const temperature_units = temperature_units_in_system(props.unit_system);
  const precip_units = precipitation_units_in_system(props.unit_system);

  https: return (
    <Card className="m-4 max-w-[600px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md">
            {props.county.name} {props.county.state}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          <StyledTooltip
            label="Precipitation"
            info="Average annual total precipitation based on data from the National Weather Service for the period 1972-1990."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              value={props.county.precipitation.toString()}
              onValueChange={(e) => props.updater("precipitation", e)}
            />{" "}
            {precip_units}
          </div>
          <StyledTooltip
            label="Minimum Temperature"
            info="Average annual maximum and minimum temperature based on data from the National Weather Service for the period 1972-1990."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              value={props.county.t_min.toString()}
              onValueChange={(e) => props.updater("t_min", e)}
            />{" "}
            {temperature_units}
          </div>
          <StyledTooltip
            label="Maximum Temperature"
            info="Average annual maximum and minimum temperature based on data from the National Weather Service for the period 1972-1990."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              value={props.county.t_max.toString()}
              onValueChange={(e) => props.updater("t_max", e)}
            />{" "}
            {temperature_units}
          </div>
          <StyledTooltip
            label="Percent Clay"
            info="Percent clay in the upper few inches of soil (A horizon). Clay content affects soil aeration and the soil's ability to hold water. Clay soils can hold more water, but too much moisture will reduce oxygen levels, which will slow the microbes responsible for decomposition and stimulate N2O emissions."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              min={0}
              max={100}
              value={props.county.clay.toString()}
              onValueChange={(e) => props.updater("clay", e)}
            />
            {" % "}
          </div>
          <StyledTooltip
            label="Carbon"
            info="Percent carbon in the upper few inches of soil (A horizon). Soil carbon is part of soil organic matter, which is comprised of decomposing plants, animals, and microbes."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              min={0}
              max={100}
              value={props.county.c_zero.toString()}
              onValueChange={(e) => props.updater("c_zero", e)}
            />
            {" % "}
          </div>
          <StyledTooltip
            label="Bulk Density"
            info="Bulk density is the mass of a given volume of soil, and is a measure of soil compaction. Compacted soils are more likely to experience oxygen depletion, which
 will slows the microbes responsible for decomposition and stimulate N2O emissions."
          />
          <div className="flex flex-row w-40">
            <Input
              type="number"
              min={0}
              max={3}
              value={props.county.bulk_density.toString()}
              onValueChange={(e) => props.updater("bulk_density", e)}
            />
            {" g/cm^3 "}
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <Link isExternal showAnchorIcon href={county_link}>
          Visit County on Wikipedia
        </Link>
      </CardFooter>
    </Card>
  );
}
