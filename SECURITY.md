# Security Policy

We take the security of the Accessibility Plugin seriously. This document
explains which releases receive security fixes, how to report a
vulnerability, and what to expect once a report is submitted.

## Supported Versions

| Version          | Supported          |
| ---------------- | ------------------ |
| 1.3.x → latest   | :white_check_mark: |
| ≤ 1.2.x          | :x:                |

Security patches are backported to the most recent minor release line and
the current stable series. Older versions have reached end-of-life and no
longer receive updates; please upgrade as soon as possible to remain
protected.

## Reporting a Vulnerability

If you discover a vulnerability, please email
**security@stiac.it** with the following details:

- A concise description of the issue and potential impact.
- Steps to reproduce, including proof-of-concept code or screenshots when
  possible.
- Any suggested mitigations or workarounds you have identified.
- How we can reach you for follow-up questions.
- Whether the issue is already public or has been shared with anyone else.

Please avoid publicly disclosing the vulnerability until we have confirmed
and released a fix. We acknowledge receipt of new reports within 2 business
days. When necessary, we can provide a PGP key for encrypted
communication—request it in your initial message if you require it.

## Response Process

1. **Triage:** We validate the report, assign a severity, and determine the
   affected versions. We will keep you informed about the status of the
   investigation at least once every 7 days.
2. **Remediation:** A fix is developed, reviewed, and regression-tested.
3. **Release:** We publish a patched release, update the changelog, and note
   the CVE (if applicable).
4. **Notification:** Reporters receive a summary of the resolution and
   public disclosure timeline, including any assigned CVE identifier.

We strive to release fixes within 14 days for high-severity issues and 30
days for medium-severity reports. Low-severity issues may be scheduled for a
later maintenance release. If we anticipate delays beyond these windows, we
will share revised timelines with the reporter as soon as they are known.

## Coordinated Disclosure

We favour coordinated vulnerability disclosure. If you plan to publish
research about an open issue, please coordinate the publication date with
our security team so users have time to deploy the fix. We do not pursue
legal action against good-faith researchers who follow this policy.

## Scope for Security Testing

Security research may target the distributed JavaScript packages, the
official CDN build (`https://cnd.stiac.it/accessibility/`), or the public
demo site linked in the README. Please do not test against production sites
belonging to our customers or attempt to access non-public data.

## Security Best Practices

- Always deploy the latest supported release.
- Configure the plugin via HTTPS to safeguard configuration changes.
- Host the script from trusted sources and verify integrity when possible.
- Review changelog entries for security-related notes before upgrading.

Thank you for helping us keep the Accessibility Plugin secure for everyone.
