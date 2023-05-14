import classNames from "classnames";
import Link from "next/link";

import { SPORTING_CODE_MANUAL_URL } from "@/config/flags";

const Download = () => (
  <article>
    <h2>Downloads</h2>
    <Link
      href={{
        pathname: SPORTING_CODE_MANUAL_URL,
      }}
      target="_blank"
      className={classNames(
        "flex flex-col items-center rounded-xl bg-awtgrey-100 p-4 text-sm font-semibold text-orange-400 shadow-md",
        "hover:bg-awtgrey-200 hover:text-orange-500"
      )}
    >
      📑 FAI Sporting Code
    </Link>
  </article>
);

export default Download;
