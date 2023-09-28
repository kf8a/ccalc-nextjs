import Link from "next/link";

export default function Credits(props: any) {
  return (
    <div className="py-12 px-36 dark:bg-slate-900 dark:text-white bg-white text-slate-800">
      <h1 className="py-4 text-lg bold">Credits</h1>
      <p>
        A detailed description of the calculator can be found in McSwiney et al.
        (2010), below. For additional information please contact
        <a href="mailto:robertson@kbs.msu.edu"> G.P. Robertson</a>
        or <a href="mailto:pr.grace@qut.edu.au">P. Grace.</a> For technical
        questions please contact
        <a href="mailto:data.manager@kbs.msu.edu"> S. Bohm</a>
      </p>
      <p>
        Created with support from the Electric Power Research Institute, the
        National Science Foundation&apos;s Long-term Ecological Research (LTER)
        Program, and the Michigan State Agricultural Experiment Station. A
        contribution of the
        <a href="http://lter.kbs.msu.edu/"> KBS LTER Program</a>
      </p>
      <h3 className="py-4 text-lg bold">Citation:</h3>
      <p>
        McSwiney, C. P., S. Bohm, P. R. Grace, and G. P. Robertson. 2010.
        Greenhouse gas emissions calculator for grain and biofuel farming
        systems. Journal of Natural Resources and Life Sciences Education
        39:125-131
      </p>
      <p className="py-4">
        <Link className="underline" href="/">
          Back
        </Link>
      </p>
    </div>
  );
}
