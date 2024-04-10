// eslint-disable-next-line import/no-namespace -- We really want all matchers here
import * as matchers from "jest-extended";
import { expect } from "@jest/globals";

expect.extend(matchers);
