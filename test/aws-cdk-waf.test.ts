import { expect as expectCDK, SynthUtils, haveResource } from "@aws-cdk/assert";
import * as cdk from "@aws-cdk/core";
import { Waf } from "../lib/index";

const createStack = () => new cdk.Stack(new cdk.App(), "TestStack");

const findFirstResourceByType = (stack: any, resourceName: string): any =>
  Object.entries(SynthUtils.toCloudFormation(stack).Resources)
    .filter(([key, value]) => (value as any).Type === resourceName)
    .map(([key, value]) => value)[0];

test("Creates regional WAF without rules when given no configuration", () => {
  // Given
  const stack = createStack();
  // When
  new Waf(stack, "MyWaf", {});
  // Then
  expectCDK(stack).to(haveResource("AWS::WAFv2::WebACL"));
  const webAcl = findFirstResourceByType(stack, "AWS::WAFv2::WebACL");
  expect(webAcl.Properties.Scope).toBe("REGIONAL");
  expect(webAcl.Properties.Rules).toHaveLength(0);
});

test("Creates cloudfront WAF", () => {
  // Given
  const stack = createStack();
  // When
  new Waf(stack, "MyWaf", { scope: "CLOUDFRONT" });
  // Then
  const webAcl = findFirstResourceByType(stack, "AWS::WAFv2::WebACL");
  expect(webAcl.Properties.Scope).toBe("CLOUDFRONT");
});

test("Creates WAF with IP address allow-list rule", () => {
  // Given
  const stack = createStack();
  // When
  new Waf(stack, "MyWaf", { ipAllowList: ["10.0.0.2/32"] });
  // Then
  expectCDK(stack).to(
    haveResource("AWS::WAFv2::IPSet", {
      Addresses: ["10.0.0.2/32"],
    })
  );
  // .... And the WAF is linked ot the set
  const webAcl = findFirstResourceByType(stack, "AWS::WAFv2::WebACL");
  const ipAddressAllowListRule = webAcl.Properties.Rules[0];
  expect(ipAddressAllowListRule).toHaveProperty("Name", "ip-allow-list");
  expect(ipAddressAllowListRule).toHaveProperty(
    "Statement.IPSetReferenceStatement"
  );
});
