import styles from "./tooltip.module.css";

// Information needed to build the tooltip
export type InteractionData = {
  xPos: number;
  yPos: number;
  name: string;
  time: number;
};

type TooltipProps = {
  interactionData: InteractionData | null;
};

export const Tooltip = ({ interactionData }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    <div
      className={styles.tooltip}
      style={{
        left: interactionData.xPos,
        top: interactionData.yPos,
      }}
    >
      Marker: {interactionData.name}
      <br />
      X: {interactionData.xPos}
      <br />
      Y: {interactionData.yPos}
      <br />
      Time: {interactionData.time}
    </div>
  );
};
