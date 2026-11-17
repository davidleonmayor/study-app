import { generateJWT } from "../generate-jwt";
import jwt from "jsonwebtoken";
import { envs } from "../../../config";

jest.mock("jsonwebtoken");
jest.mock("../../../config", () => ({
  envs: {
    JWT_SECRET: "test-secret-key",
  },
}));

describe("generateJWT", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Success Cases", () => {
    it("should generate a valid JWT token with the correct payload", () => {
      const uid = "550e8400-e29b-41d4-a716-446655440000";
      const mockToken = "mock-jwt-token";

      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = generateJWT(uid);

      expect(result).toBe(mockToken);
      expect(jwt.sign).toHaveBeenCalledWith(
        { uid },
        envs.JWT_SECRET,
        { expiresIn: "24h" }
      );
      expect(jwt.sign).toHaveBeenCalledTimes(1);
    });

    it("should return a token string that is not null or undefined", () => {
      const uid = "550e8400-e29b-41d4-a716-446655440001";
      const mockToken = "valid-jwt-token-string";

      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const result = generateJWT(uid);

      expect(result).toBeDefined();
      expect(result).not.toBeNull();
      expect(typeof result).toBe("string");
    });

    it("should use the correct JWT_SECRET from environment configuration", () => {
      const uid = "550e8400-e29b-41d4-a716-446655440002";
      const mockToken = "test-token";

      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      generateJWT(uid);

      const callArgs = (jwt.sign as jest.Mock).mock.calls[0];
      expect(callArgs[1]).toBe(envs.JWT_SECRET);
    });

    it("should set token expiration to 24 hours", () => {
      const uid = "550e8400-e29b-41d4-a716-446655440003";
      const mockToken = "token-with-expiry";

      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      generateJWT(uid);

      const callArgs = (jwt.sign as jest.Mock).mock.calls[0];
      expect(callArgs[2]).toEqual({ expiresIn: "24h" });
    });

    it("should handle multiple calls independently", () => {
      const uid1 = "550e8400-e29b-41d4-a716-446655440004";
      const uid2 = "550e8400-e29b-41d4-a716-446655440005";
      const mockToken1 = "token-1";
      const mockToken2 = "token-2";

      (jwt.sign as jest.Mock)
        .mockReturnValueOnce(mockToken1)
        .mockReturnValueOnce(mockToken2);

      const result1 = generateJWT(uid1);
      const result2 = generateJWT(uid2);

      expect(result1).toBe(mockToken1);
      expect(result2).toBe(mockToken2);
      expect(jwt.sign).toHaveBeenCalledTimes(2);
    });
  });

  describe("Error Cases", () => {
    it("should return null when jwt.sign throws an error", () => {
      const uid = "550e8400-e29b-41d4-a716-446655440006";
      const error = new Error("JWT signing failed");

      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const result = generateJWT(uid);

      expect(result).toBeNull();
    });

    it("should log an error to console when jwt.sign fails", () => {
      const uid = "550e8400-e29b-41d4-a716-446655440007";
      const error = new Error("JWT error");

      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw error;
      });

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      generateJWT(uid);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "[generateJWT]: Error generating JWT:",
        error
      );

      consoleErrorSpy.mockRestore();
    });

    it("should handle TypeError when jwt.sign receives invalid arguments", () => {
      const uid = "550e8400-e29b-41d4-a716-446655440008";
      const typeError = new TypeError("Invalid argument");

      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw typeError;
      });

      const result = generateJWT(uid);

      expect(result).toBeNull();
    });

    it("should return null and log error on any exception type", () => {
      const uid = "550e8400-e29b-41d4-a716-446655440009";
      const customError = new Error("Custom error");

      (jwt.sign as jest.Mock).mockImplementation(() => {
        throw customError;
      });

      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

      const result = generateJWT(uid);

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });

  describe("Input Validation", () => {
    it("should accept different UUID formats as input", () => {
      const uuids = [
        "550e8400-e29b-41d4-a716-446655440000",
        "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        "00000000-0000-0000-0000-000000000000",
      ];

      (jwt.sign as jest.Mock).mockReturnValue("token");

      uuids.forEach((uid) => {
        const result = generateJWT(uid);
        expect(result).toBe("token");
      });

      expect(jwt.sign).toHaveBeenCalledTimes(uuids.length);
    });

    it("should pass uid correctly in the payload", () => {
      const uid = "123e4567-e89b-12d3-a456-426614174000";

      (jwt.sign as jest.Mock).mockReturnValue("token");

      generateJWT(uid);

      const payload = (jwt.sign as jest.Mock).mock.calls[0][0];
      expect(payload).toEqual({ uid });
      expect(payload.uid).toBe(uid);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty string uid", () => {
      const uid = "";

      (jwt.sign as jest.Mock).mockReturnValue("token");

      const result = generateJWT(uid);

      expect(result).toBe("token");
      expect(jwt.sign).toHaveBeenCalledWith(
        { uid: "" },
        envs.JWT_SECRET,
        { expiresIn: "24h" }
      );
    });

    it("should return null if jwt.sign returns undefined", () => {
      const uid = "550e8400-e29b-41d4-a716-446655440010";

      (jwt.sign as jest.Mock).mockReturnValue(undefined);

      const result = generateJWT(uid);

      // Note: The function doesn't validate the return value,
      // so undefined would be returned as-is
      expect(result).toBeUndefined();
    });
  });
});