import classNames from "classnames";
import Link from "next/link";

import { SPORTING_CODE_MANUAL_URL } from "@/config/flags";

const Download = () => (
  <section>
    <h2 className="mx-auto text-center">Downloads</h2>
    <Link
      href={{
        pathname: SPORTING_CODE_MANUAL_URL,
      }}
      target="_blank"
      className={classNames(
        "flex flex-col items-start rounded-xl bg-awtgrey-100 p-4 text-sm font-semibold text-orange-400 shadow mt-4",
        "hover:bg-awtgrey-200 hover:text-orange-500"
      )}
    >
      📑 FAI Sporting Code
    </Link>
  </section>
);

export default Download;
