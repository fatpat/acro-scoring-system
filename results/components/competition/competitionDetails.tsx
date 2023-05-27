/* eslint-disable no-unused-vars */
import classNames from "classnames";
import { Fragment, useState } from "react";

import { components } from "@/types";
import { capitalise } from "@/utils/capitalise";

import { ChevronIcon, ThumbDownIcon, WarningIcon } from "../ui/icons";
import CompetitionJudges from "./competitionJudges";
import CompetitionOverallResults from "./competitionOverallResults";
import CompetitionSummary from "./competitionSummary";

interface Props {
  competition: components["schemas"]["CompetitionPublicExportWithResults"];
}

interface trProps {
  left: string;
  right?: string;
}

const TrDuo = ({ left, right }: trProps) => (
  <tr>
    <td className="py-2 pl-8">
      <small>{left}</small>
    </td>
    <td className="py-2 pl-8 text-right">
      <small>{right}</small>
    </td>
  </tr>
);

const TrPrimaryTitle = ({ left }: trProps) => (
  <tr className="text-left font-semibold">
    <td colSpan={2} className="bg-awt-dark-800 py-2 pl-6 text-white">
      <p>{left}</p>
    </td>
  </tr>
);

const TrSecondaryTitle = ({ left }: trProps) => (
  <tr>
    <td colSpan={2} className="bg-awt-dark-600 py-2 pl-6 text-white">
      <small>{left}</small>
    </td>
  </tr>
);

const CompetitionDetails = ({ competition }: Props) => {
  const { judges, name, results } = competition;

  const overallResults = results.overall_results;
  overallResults.sort((a, b) => b.score - a.score);

  const runsResults = results.runs_results;

  const [showOverall, setShowOverall] = useState(false);
  const [showRuns, setShowRuns] = useState(runsResults.map(() => false));
  const [showRunDetails, setShowRunDetails] = useState(
    runsResults.map((run) => run.results.map(() => false))
  );

  const toggleRun = (index: number) => {
    const newShowRuns = [...showRuns];
    newShowRuns[index] = !newShowRuns[index];
    setShowRuns(newShowRuns);
  };

  const toggleRunDetails = (runIndex: number, resultIndex: number) => {
    const newShowDetails = [...showRunDetails];
    newShowDetails[runIndex][resultIndex] =
      !newShowDetails[runIndex][resultIndex];
    setShowRunDetails(newShowDetails);
  };

  return (
    <>
      <h2 className="text-center">{name}</h2>
      <div
        className={classNames(
          "mt-4 flex w-full flex-col justify-evenly gap-6 px-4 overflow-x-scroll",
          "lg:flex-row"
        )}
      >
        <CompetitionSummary competition={competition} />

        <section
          className={classNames(
            "flex w-full flex-col rounded-xl bg-awt-dark-50"
          )}
        >
          <header
            role="button"
            tabIndex={0}
            className={classNames(
              "flex cursor-pointer items-baseline pl-4 pt-4"
            )}
            onClick={() => setShowOverall(!showOverall)}
            onKeyDown={({ key }) =>
              key === "Enter" && setShowOverall(!showOverall)
            }
          >
            <h3>Overall Results</h3>
            <ChevronIcon
              className={classNames(
                "ml-2 h-3 w-auto",
                !showOverall && "-rotate-90"
              )}
            />
          </header>

          {showOverall && (
            <CompetitionOverallResults results={overallResults} />
          )}

          {runsResults.map((run, runIndex) => {
            const runNumber = runIndex + 1;

            return (
              <article key={runNumber}>
                <header
                  role="button"
                  tabIndex={0}
                  className={classNames(
                    "flex cursor-pointer items-baseline pl-4 pt-4"
                  )}
                  onClick={() => toggleRun(runIndex)}
                  onKeyDown={({ key }) =>
                    key === "Enter" && toggleRun(runIndex)
                  }
                >
                  <h3>{`Run ${runNumber}`}</h3>
                  <ChevronIcon
                    className={classNames(
                      "ml-2 h-3 w-auto",
                      !showRuns[runIndex] && "-rotate-90"
                    )}
                  />
                </header>
                {showRuns[runIndex] && (
                  <table className="w-full origin-top">
                    <thead>
                      <tr>
                        <th className="bg-awt-dark-800 text-left text-white">
                          Pilot
                        </th>
                        <th className="bg-awt-dark-800 text-right text-white">
                          Judge&apos;s Marks
                        </th>
                        <th className="bg-awt-dark-800 text-right text-white">
                          Bonus
                        </th>
                        <th className="bg-awt-dark-800 text-right text-white">
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {run.results
                        .sort(
                          (a, b) =>
                            (b.final_marks?.score || 0) -
                            (a.final_marks?.score || 0)
                        )
                        .map((result, resultIndex) => {
                          const {
                            pilot,
                            final_marks,
                            tricks,
                            // marks,
                            // warnings,
                          } = result;

                          const roundedScore =
                            final_marks?.score?.toFixed(3) ?? "No score record";

                          const {
                            score,
                            technicity,
                            bonus_percentage: bonusPercentage,
                            malus,
                            judges_mark,
                            technical: technicalFinal,
                            choreography: choreographyFinal,
                            landing: landingFinal,
                            synchro: synchroFinal,
                            bonus,
                            warnings,
                            notes,
                          } = final_marks ?? {};

                          const {
                            technical: technicalJudge,
                            choreography: choreographyJudge,
                            landing: landingJudge,
                            synchro: synchroJudge,
                          } = judges_mark ?? {};

                          return (
                            <Fragment key={resultIndex}>
                              <tr>
                                <td
                                  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                                  role="button"
                                  tabIndex={0}
                                  className={classNames(
                                    "flex cursor-pointer items-baseline"
                                  )}
                                  onClick={() =>
                                    toggleRunDetails(runIndex, resultIndex)
                                  }
                                  onKeyDown={({ key }) =>
                                    key === "Enter" &&
                                    toggleRunDetails(runIndex, resultIndex)
                                  }
                                >
                                  <p>{pilot ? pilot.name : "No name record"}</p>
                                  <ChevronIcon
                                    className={classNames(
                                      "ml-2 h-2 w-auto",
                                      !showRunDetails[runIndex][resultIndex] &&
                                        "-rotate-90"
                                    )}
                                  />
                                </td>
                                <td className="text-right">
                                  <p>
                                    {technicalJudge?.toFixed(3)}
                                    &nbsp;/&nbsp;
                                    {choreographyJudge?.toFixed(3)}
                                    &nbsp;/&nbsp;
                                    {landingJudge?.toFixed(3)}
                                    {run.type === "synchro" && (
                                      <>
                                        &nbsp;/&nbsp;
                                        {synchroJudge?.toFixed(3)}
                                      </>
                                    )}
                                    {(warnings?.length || 0) > 0 && (
                                      <>
                                        &nbsp;/&nbsp;
                                        <WarningIcon />
                                      </>
                                    )}
                                  </p>
                                </td>
                                <td className="text-right">
                                  <p>{bonusPercentage}%</p>
                                  {(malus || 0) > 0 && <ThumbDownIcon />}
                                </td>
                                <td className="text-right">
                                  <p>{roundedScore}</p>
                                </td>
                              </tr>

                              {showRunDetails[runIndex][resultIndex] && (
                                <>
                                  <TrPrimaryTitle left="Tricks" />
                                  {tricks.map((trick, trickIndex) => {
                                    const {} = trick;
                                    return (
                                      <tr key={trickIndex}>
                                        <td colSpan={2} className="py-2 pl-8">
                                          <small>
                                            {capitalise(trick.name)}
                                          </small>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                  <TrPrimaryTitle left="Details" />
                                  <TrDuo
                                    left="Technicity"
                                    right={`${technicity?.toFixed(3)}`}
                                  />
                                  <TrDuo left="Malus" right={`${malus}%`} />
                                  <TrDuo
                                    left="Final Technical"
                                    right={`${technicalFinal?.toFixed(3)}`}
                                  />
                                  <TrDuo
                                    left="Final Choreography"
                                    right={`${choreographyFinal?.toFixed(3)}`}
                                  />
                                  <TrDuo
                                    left="Final Landing"
                                    right={`${landingFinal?.toFixed(3)}`}
                                  />
                                  {run.type === "synchro" && (
                                    <TrDuo
                                      left="Final Synchro"
                                      right={`${synchroFinal?.toFixed(3)}`}
                                    />
                                  )}
                                  <TrDuo
                                    left="Final Bonus"
                                    right={`${bonus?.toFixed(3)}`}
                                  />
                                  {(warnings?.length || 0) > 0 && (
                                    <>
                                      <TrSecondaryTitle left="Warnings" />
                                      {warnings?.map(
                                        (warning, warningIndex) => {
                                          return (
                                            <TrDuo
                                              key={warningIndex}
                                              left="Warning"
                                              right={warning}
                                            />
                                          );
                                        }
                                      )}
                                    </>
                                  )}
                                  {(notes?.length || 0) > 0 && (
                                    <>
                                      <TrSecondaryTitle left="Notes" />
                                      {notes?.map((note, noteIndex) => {
                                        return (
                                          <TrDuo
                                            key={noteIndex}
                                            left="Note"
                                            right={note}
                                          />
                                        );
                                      })}
                                    </>
                                  )}
                                </>
                              )}
                            </Fragment>
                          );
                        })}
                    </tbody>
                  </table>
                )}
              </article>
            );
          })}
        </section>

        <CompetitionJudges judges={judges} />
      </div>
    </>
  );
};

export default CompetitionDetails;
