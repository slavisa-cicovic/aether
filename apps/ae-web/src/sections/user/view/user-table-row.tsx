"use client";

import { MouseEvent, useState } from "react";
import {
  Checkbox,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTranslations } from "next-intl";
import { IUserListItem } from "@/types/user";

type Props = {
  row: IUserListItem;
  selected: boolean;
  onEditRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
}: Props) {
  const t = useTranslations("user.table");
  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseMenu = () => setOpenMenu(null);

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2">{row.firstName}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2">{row.lastName}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {row.email}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2" color="text.secondary">
            {row.lang || "-"}
          </Typography>
        </TableCell>

        <TableCell>
          <Chip
            label={row.active ? t("active") : t("inactive")}
            color={row.active ? "success" : "default"}
            size="small"
            variant="filled"
          />
        </TableCell>

        <TableCell>
          <Chip
            label={row.locked ? t("locked") : t("unlocked")}
            color={row.locked ? "warning" : "default"}
            size="small"
            variant="filled"
          />
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenMenu}>
            <MoreVertIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      <Menu
        anchorEl={openMenu}
        open={Boolean(openMenu)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            handleCloseMenu();
          }}
        >
          {t("edit")}
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDeleteRow();
            handleCloseMenu();
          }}
          sx={{ color: "error.main" }}
        >
          {t("delete")}
        </MenuItem>
      </Menu>
    </>
  );
}
