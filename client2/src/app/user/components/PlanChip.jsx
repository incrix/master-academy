import { Chip, Avatar } from "@mui/material";
export default function PlanChip({ plan }) {
  return (
    <Chip
      label={plan}
      sx={{
        backgroundColor: plan == 'Free'? "rgba(2, 201, 79, 0.10)" : plan == 'Standard' ? "rgba(255, 126, 7, 0.10)" :plan == 'Pro' ? 'rgba(243, 59, 18, 0.10)': null,
        color:  plan == 'Free'?  "#02C94F": plan == 'Standard' ? "#FF7E07" :plan == 'Pro' ? '#F33B12': null,
        fontWeight: "bold",
        padding: "0px 10px 0px 5px",
        border: plan == 'Free'? "1px solid #02C94F": plan == 'Standard' ? "1px solid rgba(255, 126, 7, 0.40)" :plan == 'Pro' ? '1px solid rgba(243, 59, 18, 0.40)': null,
      }}
      avatar={
        <Avatar
          sx={{
            width: "12px !important",
            height: "12px !important",
            margin: "0px 0px 0px 10px !important",
            backgroundColor: plan == "Free" ? "#02C94F !important" : plan == 'Standard' ? "#FF7E07" :plan == 'Pro' ? '#F33B12': null ,
            color: plan == "Free" ? "#02C94F !important" : plan == 'Standard' ? "#FF7E07 !important" :plan == 'Pro' ? '#F33B12 !important': null ,
            fontSize: "4px",
            fontWeight: "bold",
          }}
        />
      }
    />
  );
}
