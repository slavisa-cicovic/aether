"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Card, Stack, Table, TableBody, TableContainer, Typography } from "@mui/material";
import {
  useTable,
  TableHeadCustom,
  TablePaginationCustom,
  TableEmptyRows,
  TableNoData,
  emptyRows,
  getComparator
} from "@/components/table";
import { deleteUser, useGetUsers } from "@/api/user";
import { IUserListItem } from "@/types/user";
import UserTableRow from "./user-table-row";

const denseHeight = 64;

export default function UserListView() {
  const router = useRouter();
  const t = useTranslations("user");
  const tTable = useTranslations("user.table");

  const TABLE_HEAD = useMemo(
    () => [
      { id: "firstName", label: tTable("firstName") },
      { id: "lastName", label: tTable("lastName") },
      { id: "email", label: tTable("email") },
      { id: "lang", label: tTable("lang") },
      { id: "active", label: tTable("active") },
      { id: "locked", label: tTable("locked") },
      { id: "actions", label: "", align: "right" }
    ],
    [tTable]
  );

  const table = useTable({
    defaultRowsPerPage: 25,
    defaultDense: true,
    defaultOrderBy: "firstName"
  });
  const { users, usersLoading, mutate } = useGetUsers();

  const dataFiltered: IUserListItem[] = useMemo(() => {
    const comparator = getComparator<any>(table.order, table.orderBy as keyof IUserListItem);
    return [...users].sort((a, b) => comparator(a as any, b as any));
  }, [table.order, table.orderBy, users]);

  const dataInPage = useMemo(
    () =>
      dataFiltered.slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
      ),
    [dataFiltered, table.page, table.rowsPerPage]
  );

  const isNotFound = !usersLoading && !dataFiltered.length;

  const handleCreate = () => router.push("/user/new");
  const handleEditRow = (id: number) => router.push(`/user/${id}/edit`);

  const handleDeleteRow = async (id: number) => {
    await deleteUser(id);
    await mutate();
    table.onUpdatePageDeleteRow(dataInPage.length);
  };

  return (
    <Stack spacing={3}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" fontWeight="bold">
          {t("listTitle")}
        </Typography>
        <Button variant="contained" onClick={handleCreate}>
          {t("create")}
        </Button>
      </Stack>

      <Card>
        <TableContainer sx={{ position: "relative" }}>
          <Table size={table.dense ? "small" : "medium"}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={checked =>
                table.onSelectAllRows(
                  checked,
                  dataFiltered.map(row => row.id)
                )
              }
            />

            <TableBody>
              {dataInPage.map(row => (
                <UserTableRow
                  key={row.id}
                  row={row}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                  onEditRow={() => handleEditRow(row.id)}
                  onDeleteRow={() => handleDeleteRow(row.id)}
                />
              ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
              />

              <TableNoData title={tTable("noData")} notFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>

        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Stack>
  );
}
