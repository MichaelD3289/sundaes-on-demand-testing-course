import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

test("order phases for happy path", async () => {
  // render app
  render(<App />);

  // add ice cream scoops and toppings
  const chocolateScoop = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  const hotFudgeTopping = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });

  userEvent.clear(chocolateScoop);
  userEvent.type(chocolateScoop, "2");
  userEvent.click(hotFudgeTopping);

  // find and click order button
  const orderBtn = await screen.findByRole("button", { name: "Order Sundae!" });
  userEvent.click(orderBtn);

  // check summary information based on order
  const scoopsSubtotal = screen.getByRole("heading", { name: /scoops: \$/i });
  const toppingsSubtotal = screen.getByRole("heading", {
    name: /toppings: \$/i,
  });

  expect(scoopsSubtotal).toHaveTextContent("4.00");
  expect(toppingsSubtotal).toHaveTextContent("1.50");

  // removed due to mockup change, can be uncommented if reverted back
  // const grandTotal = screen.getByRole("heading", { name: /total \$/i });
  // expect(grandTotal).toHaveTextContent("5.50");

  const optionItems = screen.getAllByRole("listitem");
  const optionItemsText = optionItems.map((item) => item.textContent);
  expect(optionItemsText).toEqual(["2 Chocolate", "Hot fudge"]);
  // OR
  // expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  // expect(screen.getByText("1 Hot fudge")).toBeInTheDocument();

  // accept terms and conditions and click button to confirm order
  const termsConditionsCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const confirmOrderBtn = screen.getByRole("button", { name: "Confirm order" });

  userEvent.click(termsConditionsCheckbox);
  userEvent.click(confirmOrderBtn);

  const loadingStatus = screen.getByText(/loading/i);
  expect(loadingStatus).toBeInTheDocument();

  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  const notLoading = screen.queryByText("loading");
  expect(notLoading).not.toBeInTheDocument();

  // confirm order number on confirmation page
  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // click "new order" button on confirmation page
  const newOrderBtn = screen.getByRole("button", { name: "Create new order" });
  userEvent.click(newOrderBtn);

  // check that the scoops and toppings subtotals have been reset
  const scoopsSubtotalReset = await screen.findByText("Scoops total: $0.00");
  const toppingsSubtotalReset = await screen.findByText(
    "Toppings total: $0.00"
  );

  expect(scoopsSubtotalReset).toBeInTheDocument();
  expect(toppingsSubtotalReset).toBeInTheDocument();

  // do we need to await anything to avoid test errors?
  // these are awaited at end of test to ensure no test errors from component updates after test is complete
  await screen.findByRole("spinbutton", { name: "Chocolate" });
  await screen.findByRole("checkbox", { name: "Hot fudge" });
});

test("Toppings header is not on summary page if no toppings ordered", async () => {
  render(<App />);

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });

  userEvent.clear(vanillaInput);
  userEvent.clear(chocolateInput);

  userEvent.type(vanillaInput, "1");
  userEvent.type(chocolateInput, "2");

  const orderSummaryButton = await screen.findByRole("button", {
    name: "Order Sundae!",
  });
  expect(orderSummaryButton).toBeEnabled();
  userEvent.click(orderSummaryButton);

  // const scoopsHeading = screen.getByRole("heading", {
  //   name: "Scoops: $6.00",
  // });
  // expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole("heading", { name: /toppings/i });
  expect(toppingsHeading).not.toBeInTheDocument();
});

test("Toppings header is not on summary page if toppings ordered, then removed", async () => {
  render(<App />);

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");

  const cherriesTopping = await screen.findByRole("checkbox", {
    name: "Cherries",
  });
  userEvent.click(cherriesTopping);

  const toppingsTotal = screen.getByText("Toppings total: $", { exact: false });
  expect(toppingsTotal).toHaveTextContent("1.50");

  userEvent.click(cherriesTopping);
  expect(cherriesTopping).not.toBeChecked();
  expect(toppingsTotal).toHaveTextContent("0.00");

  const orderSummaryButton = screen.getByRole("button", {
    name: "Order Sundae!",
  });
  expect(orderSummaryButton).toBeEnabled();
  userEvent.click(orderSummaryButton);

  // const scoopsHeading = screen.getByRole("heading", {
  //   name: "Scoops: $2.00",
  // });
  // expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole("heading", { name: /toppings/i });
  expect(toppingsHeading).not.toBeInTheDocument();
});
