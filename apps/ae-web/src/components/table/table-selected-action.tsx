import React from 'react';
// @mui
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Stack, { StackProps } from '@mui/material/Stack';
import { useTranslations } from 'next-intl';

// ----------------------------------------------------------------------

interface Props extends StackProps {
  dense?: boolean;
  actionDelete?: React.ReactNode;
  actionActivate?: React.ReactNode;
  actionDeactivate?: React.ReactNode;
  rowCount: number;
  numSelected: number;
  onSelectAllRows: (checked: boolean) => void;
  headerHeight: number;
}

export default function TableSelectedAction({
  dense,
  actionDelete,
  actionActivate,
  actionDeactivate,
  rowCount,
  numSelected,
  onSelectAllRows,
  sx,
  headerHeight,
  ...other
}: Props) {

  const t = useTranslations("table.selected_action");

  if (!numSelected) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        ml: 2.5,
        pl: 1,
        pr: 2,
        top: 0,
        left: 0,
        width: 'calc(100% - 40px)',
        zIndex: 9,
        height: 58,
        position: 'absolute',
        bgcolor: 'primary.lighter',
        ...(dense && {
          height: headerHeight,
        }),
        ...sx,
      }}
      {...other}
    >
      <Checkbox
        indeterminate={!!numSelected && numSelected < rowCount}
        checked={!!rowCount && numSelected === rowCount}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onSelectAllRows(event.target.checked)
        }
      />

      <Typography
        variant="subtitle2"
        sx={{
          ml: 2,
          flexGrow: 1,
          color: 'primary.main',
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        {numSelected} {t('selected')}
      </Typography>

      {actionDelete && actionDelete}
      {actionActivate && actionActivate}
      {actionDeactivate && actionDeactivate}
    </Stack>
  );
}
