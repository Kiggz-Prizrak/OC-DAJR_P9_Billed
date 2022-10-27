/**
 * @jest-environment jsdom
 */



import _modal from "jquery-modal";

import "@testing-library/jest-dom";

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";

import NewBill from "../containers/NewBill.js";

import { ROUTES, ROUTES_PATH } from "../constants/routes.js";

import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import { bills, bills_badDate } from "../fixtures/bills.js";

import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    /////////////////////////////
    test("Then I got all tickets", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const trList = document.querySelectorAll("tbody tr");
      expect(trList.length).toBe(bills.length);
    });
    /////////////////////////////
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
        })
      );
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      //to-do write expect expression
      expect(windowIcon).toHaveClass("active-icon");
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });

    test("then I got bad date", () => {
      document.body.innerHTML = BillsUI({ data: bills_badDate });
      const trList = document.querySelectorAll("tbody tr");
      expect(trList.length).toBe(bills_badDate.length);
    });
  });

  describe("when I click on picture Btn", () => {
    test("then a modal contains bill should appears", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const billsContainer = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });

      document.body.innerHTML = BillsUI({ data: bills });
      const iconEyesList = screen.getAllByTestId("icon-eye");

    //  console.log(iconEyesList);

      const handleClick = jest.fn(
        billsContainer.handleClickIconEye(iconEyesList[0])
      );

      iconEyesList.forEach((icon) => {
        icon.addEventListener("click", handleClick);
      });

      userEvent.click(iconEyesList[0]);
      expect(handleClick).toHaveBeenCalled();

      // const modale = document.getElementById("modaleFile");
      // expect(modale).toBeTruthy();
    });
  });

  describe("when I click on NewBills Btn", () => {
    test("then I'm redirected on Newbills view", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      const bills = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage,
      });
      document.body.innerHTML = BillsUI({ data: bills });
      const handleNewBillClick = jest.fn((e) => bills.handleClickNewBill());
      // équivalent en jest :
      // document.querySelector("#root > div > div.content > div.content-header > button");
      const button = screen.getByTestId("btn-new-bill");
      button.addEventListener("click", handleNewBillClick);
      //userEvent simule une action
      userEvent.click(button);
      expect(handleNewBillClick).toHaveBeenCalled();
    });
  });
});
