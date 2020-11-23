# CDK Construct: Waf

CDK Construct Library containing the `Waf` construct. It can be used to easily generate
a WAF (Web Application Firewall) supporting IP allow listing.

## How to use

    new Waf(this, "some-waf", {
      ipAllowList: ["10.0.0.2/32"],
    });

Creates a WAF associated with a an IP allow list rule. The IPs must be valid IP CIDRs.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
