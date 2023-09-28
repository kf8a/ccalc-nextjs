"use strict";
import React from "react";
import MapComponent from "@/components/map";
import { NextUIProvider } from "@nextui-org/react";

export default function Home() {
  return (
    <div className="dark dark:bg-slate-900 text-slate-900 dark:text-white flex min-h-screen flex-col items-center justify-between py-12 px-36">
      <p>
        This calculator was created to help farmers, extension educators,
        agencies, policymakers, and others learn about greenhouse gas emissions
        from field crop agriculture in order to make informed decisions about
        crop management and environmental stewardship.
      </p>
      <h2 className="p-4 text-xl">
        Field crop agriculture and greenhouse gas emissions
      </h2>
      <p>
        About 6% of total greenhouse gas emissions in the United States are
        associated with the agricultural sector. Farmers already play an
        important role in reducing the impact of greenhouse gases, for example,
        through non-crop land management. Recent research indicates there are
        more opportunities for farmers to enhance their environmental
        stewardship. By altering or adopting management practices for field
        crops, farmers can reduce their greenhouse gas footprint, and make a
        substantial contribution to reducing the severity of climate change both
        regionally and at the global scale.
      </p>
      <p>
        The two major greenhouse gases from field crop agriculture are carbon
        dioxide (CO2) and nitrous oxide (N2O). Carbon dioxide is emitted through
        fossil fuel use on and off the farm, from activities such as vehicle use
        and fertilizer production. It can also be emitted or sequestered
        (stored) in the soil. Whether o r not soil carbon sequestration occurs
        depends on the type of land and the farming practices, for example, s
        oil tillage and plant residue management. Nitrous oxide is a very
        powerful greenhouse gas and is emitted pri marily through soil
        management activities such as nitrogen fertilizer application.
      </p>
      <h3 className="p-4 text-xl">
        Calculate and compare the greenhouse gas impact of different cropping
        systems
      </h3>
      <p>
        The calculator allows you to compare the greenhouse gas footprint from
        different cropping systems. Begin by clicking on a county on the map
        below. The next screen will show an estimate of the greenhouse gas cost
        (in a unit called CO2 equivalents) of a &quot;baseline scenario&quot;
        corn-soybean rotation in that county, based upon USDA data. Next, change
        the crop, tillage type, fertilizer rate and environmental variables to
        create new scenarios that will be compared to the baseline scenario.
      </p>
      <p className="p-4 text-sm">
        Click on your county of interest below to begin!
      </p>
      <MapComponent />
    </div>
  );
}
