import { describe, test, expect, vi, beforeEach } from "vitest";
import { ZodError } from "zod";
import { Error } from "mongoose";

import User from "../../../src/models/User";
import UserVerification from "../../../src/models/UserVerification";
import getVerificationHandler from "../../../src/controllers/users/getVerificationHandler";

describe("When request body is null", () => {
  test("raises ZodError with issues", async () => {
    const req = { body: null }
    try {
      await getVerificationHandler(req, {})
    } catch(err) {
      expect(err instanceof ZodError).toBeTruthy();
      expect(err.issues).toHaveLength(1);
      expect(err.issues[0]['expected']).toEqual('object');
    }
  });
});

describe("When request body missing required params", () => {
  test("raises ZodError with issues", async () => {
    const req = { body: { email: "          " } }

    try {
      await getVerificationHandler(req, {})
    } catch(err) {
      expect(err instanceof ZodError).toBeTruthy();
      const missingPaths = err.issues.map(issue => issue.path.join('.'));
      expect(missingPaths).toContain('email');
    }
  });
});

describe("When request body params with incorrect format", () => {
  test("raises ZodError with issues", async () => {
    const req = { body: { email: "invalid-email" } }

    try {
      await getVerificationHandler(req, {})
    } catch(err) {
      expect(err instanceof ZodError).toBeTruthy();
      const missingPaths = err.issues.map(issue => issue.path.join('.'));
      expect(missingPaths).toContain('email');
    }
  });
});


describe("when request body correct", () => {
  let res;
  const email = "valid@example.com";
  const req = { body: { email: email } };
    
  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), send: vi.fn().mockReturnThis() };
  });

  describe("User does not exist", () => {
    test("Throws DocumentNotFoundError", async () => {
      const user = new User({ email, status: "active", password: "P@ssw0rd123" });
      await user.save();

      try {
        await getVerificationHandler(req, res);
      } catch(err) {
        expect(err instanceof Error.DocumentNotFoundError).toBeTruthy();
      }
    });
  });

  describe("User exist and first verification", () => {
    test("Creates verification", async () => {
      const user = new User({ email, password: "P@ssw0rd123" });
      await user.save();

      await getVerificationHandler(req, res);
      
      const verification = await UserVerification.findOne({ email }).orFail();
      expect(verification.code).toHaveLength(6);
      expect(verification.uuid.length()).toBe(16);
      expect(verification.expiresAt.valueOf()).toBeGreaterThan(new Date().valueOf());

      expect(res.status).toHaveBeenCalledExactlyOnceWith(204);
      expect(res.send).toHaveBeenCalledExactlyOnceWith();
    });
  });

  describe("User exist and second verification", () => {
    test("Creates verification", async () => {
      const user = new User({ email, password: "P@ssw0rd123" });
      await user.save();

      let verification = new UserVerification({ email })
      verification.generateCode();
      await verification.save();

      await getVerificationHandler(req, res);
      
      verification = await UserVerification.findOne({ email }).orFail();
      expect(verification.code).toHaveLength(6);
      expect(verification.uuid.length()).toBe(16);
      expect(verification.expiresAt.valueOf()).toBeGreaterThan(new Date().valueOf());

      expect(res.status).toHaveBeenCalledExactlyOnceWith(204);
      expect(res.send).toHaveBeenCalledExactlyOnceWith();
    });
  });
});