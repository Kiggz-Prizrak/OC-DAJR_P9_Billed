/**
 * @jest-environment jsdom
 */

import _modal from "jquery-modal";

import "@testing-library/jest-dom";

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";

import { ROUTES, ROUTES_PATH } from "../constants/routes";

import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";

import { bills } from "../fixtures/bills";

import router from "../app/Router.js";

jest.mock("../app/Store", () => mockStore);

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then, form appears", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      document.body.innerHTML = NewBillUI({ loading: true });

      const form = screen.getByTestId("form-new-bill");

      expect(form).toBeTruthy();
    });

    //////////////////////////////////////

    describe("Given I am connected as an employee", () => {
      test("Then I change media on form", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const file = new File(["hello"], "hello.png", { type: "image/png" });
        const store = null;
        const inputFile = screen.getByTestId("file");

        const newbill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });

        const handle = jest.fn((e) => newbill.handleChangeFile(e));
        // inputFile.value = ".png";
        console.log(inputFile.value);

        inputFile.addEventListener("change", handle);

        userEvent.upload(inputFile, file);
        expect(handle).toHaveBeenCalled();



      });

      test("then I provides aull fields and click on submit", () => {
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
          })
        );

        const onNavigate = (pathname) => {
          document.body.innerHTML = ROUTES({ pathname });
        };

        const store = null;
        const form = screen.getByTestId("form-new-bill");

        const test = document.querySelector("#btn-send-bill");

        const newbill = new NewBill({
          document,
          onNavigate,
          store,
          localStorage: window.localStorage,
        });

        const handle = jest.fn(() => newbill.handleAcceptSubmit);

        test.addEventListener("click", handle);

        userEvent.click(test);
        expect(handle).toHaveBeenCalled();
      });
    });

    //////////////////////////////////////////////////
    ////// API
    describe("When an error occurs on API", () => {
      beforeEach(() => {
        jest.spyOn(mockStore, "bills");
        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });
        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a",
          })
        );
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
      });
      test.skip("fetches bills from an API and fails with 404 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 404"));
            },
          };
        });
        window.onNavigate(ROUTES_PATH.NewBill);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 404/);
        expect(message).toBeTruthy();
      });

      test.skip("fetches messages from an API and fails with 500 message error", async () => {
        mockStore.bills.mockImplementationOnce(() => {
          return {
            list: () => {
              return Promise.reject(new Error("Erreur 500"));
            },
          };
        });

        window.onNavigate(ROUTES_PATH.NewBill);
        await new Promise(process.nextTick);
        const message = await screen.getByText(/Erreur 500/);
        expect(message).toBeTruthy();
      });
    });
  });
});
