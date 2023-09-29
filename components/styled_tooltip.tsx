import React from "react";
import { Tooltip } from "@nextui-org/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export default function StyledTooltip(props: { label: string; info: string }) {
  return (
    <div className="flex flex-row ">
      {props.label}
      <Tooltip
        delay={500}
        // @ts-ignore
        trigger={["focus", "hover"]}
        className="w-60 dark dark:bg-slate-900 dark:text-white bg-white text-slate-800"
        content={props.info}
      >
        <InformationCircleIcon className="ml-2 w-4 h-4" />
      </Tooltip>
    </div>
  );
}
