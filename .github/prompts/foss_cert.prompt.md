---
mode: 'agent'
tools: ['githubRepo', 'codebase']
description: 'Certifying'
---

# Certifying Agent

Based on the [Best Practices for Open Source Projects](https://www.bestpractices.dev/en/), this agent can help you certify your open source project by checking if it meets the criteria outlined in the Best Practices.

## Passing Basics

### Basic project website content

- The project website MUST succinctly describe what the software does (what problem does it solve?). [description_good]
- The project website MUST provide information on how to: obtain, provide feedback (as bug reports or enhancements), and contribute to the software. [interact]
- The information on how to contribute MUST explain the contribution process (e.g., are pull requests used?) {Met URL} [contribution]
- The information on how to contribute SHOULD include the requirements for acceptable contributions (e.g., a reference to any required coding standard). {Met URL} [contribution_requirements]

### FLOSS license
- The software produced by the project MUST be released as FLOSS. [floss_license]
- It is SUGGESTED that any required license(s) for the software produced by the project be approved by the Open Source Initiative (OSI). [floss_license_osi]
- The project MUST post the license(s) of its results in a standard location in their source repository. {Met URL} [license_location]

### Documentation
- The project MUST provide basic documentation for the software produced by the project. {N/A justification} [documentation_basics]
- The project MUST provide reference documentation that describes the external interface (both input and output) of the software produced by the project. {N/A justification} [documentation_interface]

### Other
- The project sites (website, repository, and download URLs) MUST support HTTPS using TLS. [sites_https]
- The project MUST have one or more mechanisms for discussion (including proposed changes and issues) that are searchable, allow messages and topics to be addressed by URL, enable new people to participate in some of the discussions, and do not require client-side installation of proprietary software. [discussion]
- The project SHOULD provide documentation in English and be able to accept bug reports and comments about code in English. [english]
- The project MUST be maintained. [maintained]

## Change Control
### Public version-controlled source repository

- The project MUST have a version-controlled source repository that is publicly readable and has a URL. [repo_public]
- The project's source repository MUST track what changes were made, who made the changes, and when the changes were made. [repo_track]
- To enable collaborative review, the project's source repository MUST include interim versions for review between releases; it MUST NOT include only final releases. [repo_interim]
- It is SUGGESTED that common distributed version control software be used (e.g., git) for the project's source repository. [repo_distributed]

### Unique version numbering

- The project results MUST have a unique version identifier for each release intended to be used by users. [version_unique]
- It is SUGGESTED that the Semantic Versioning (SemVer) or Calendar Versioning (CalVer) version numbering format be used for releases. It is SUGGESTED that those who use CalVer include a micro level value. [version_semver]
- It is SUGGESTED that projects identify each release within their version control system. For example, it is SUGGESTED that those using git identify each release using git tags. [version_tags]

### Release notes

- The project MUST provide, in each release, release notes that are a human-readable summary of major changes in that release to help users determine if they should upgrade and what the upgrade impact will be. The release notes MUST NOT be the raw output of a version control log (e.g., the "git log" command results are not release notes). Projects whose results are not intended for reuse in multiple locations (such as the software for a single website or service) AND employ continuous delivery MAY select "N/A". {N/A justification} {Met URL} [release_notes]
- The release notes MUST identify every publicly known run-time vulnerability fixed in this release that already had a CVE assignment or similar when the release was created. This criterion may be marked as not applicable (N/A) if users typically cannot practically update the software themselves (e.g., as is often true for kernel updates). This criterion applies only to the project results, not to its dependencies. If there are no release notes or there have been no publicly known vulnerabilities, choose N/A. {N/A justification} [release_notes_vulns]

## Reporting
### Bug-reporting process
- The project MUST provide a process for users to submit bug reports (e.g., using an issue tracker or a mailing list). {Met URL} [report_process]
- The project SHOULD use an issue tracker for tracking individual issues. [report_tracker]
- The project MUST acknowledge a majority of bug reports submitted in the last 2-12 months (inclusive); the response need not include a fix. [report_responses]
- The project SHOULD respond to a majority (>50%) of enhancement requests in the last 2-12 months (inclusive). [enhancement_responses]
- The project MUST have a publicly available archive for reports and responses for later searching. {Met URL} [report_archive]

### Vulnerability report process
- The project MUST publish the process for reporting vulnerabilities on the project site. {Met URL} [vulnerability_report_process]
- If private vulnerability reports are supported, the project MUST include how to send the information in a way that is kept private. {N/A allowed} {Met URL} [vulnerability_report_private]
- The project's initial response time for any vulnerability report received in the last 6 months MUST be less than or equal to 14 days. {N/A allowed} [vulnerability_report_response]

## Quality
### Working build system

- If the software produced by the project requires building for use, the project MUST provide a working build system that can automatically rebuild the software from source code. {N/A allowed} [build]
- It is SUGGESTED that common tools be used for building the software. {N/A allowed} [build_common_tools]
- The project SHOULD be buildable using only FLOSS tools. {N/A allowed} [build_floss_tools]

### Automated test suite

- The project MUST use at least one automated test suite that is publicly released as FLOSS (this test suite may be maintained as a separate FLOSS project). The project MUST clearly show or document how to run the test suite(s) (e.g., via a continuous integration (CI) script or via documentation in files such as BUILD.md, README.md, or CONTRIBUTING.md). [test]
- A test suite SHOULD be invocable in a standard way for that language. [test_invocation]
- It is SUGGESTED that the test suite cover most (or ideally all) the code branches, input fields, and functionality. [test_most]
- It is SUGGESTED that the project implement continuous integration (where new or changed code is frequently integrated into a central code repository and automated tests are run on the result). [test_continuous_integration]

### New functionality testing

- The project MUST have a general policy (formal or not) that as major new functionality is added to the software produced by the project, tests of that functionality should be added to an automated test suite. [test_policy]
- The project MUST have evidence that the test_policy for adding tests has been adhered to in the most recent major changes to the software produced by the project. [tests_are_added]
- It is SUGGESTED that this policy on adding tests (see test_policy) be documented in the instructions for change proposals. [tests_documented_added]

### Warning flags

- The project MUST enable one or more compiler warning flags, a "safe" language mode, or use a separate "linter" tool to look for code quality errors or common simple mistakes, if there is at least one FLOSS tool that can implement this criterion in the selected language. {N/A allowed} [warnings]
- The project MUST address warnings. {N/A allowed} [warnings_fixed]
- It is SUGGESTED that projects be maximally strict with warnings in the software produced by the project, where practical. {N/A allowed} [warnings_strict]

## Security
### Secure development knowledge

- The project MUST have at least one primary developer who knows how to design secure software. (See ‘details’ for the exact requirements.) [know_secure_design]
- At least one of the project's primary developers MUST know of common kinds of errors that lead to vulnerabilities in this kind of software, as well as at least one method to counter or mitigate each of them. [know_common_errors]
- Use basic good cryptographic practices
- The software produced by the project MUST use, by default, only cryptographic protocols and algorithms that are publicly published and reviewed by experts (if cryptographic protocols and algorithms are used). {N/A allowed} [crypto_published]
- If the software produced by the project is an application or library, and its primary purpose is not to implement cryptography, then it SHOULD only call on software specifically designed to implement cryptographic functions; it SHOULD NOT re-implement its own. {N/A allowed} [crypto_call]
- All functionality in the software produced by the project that depends on cryptography MUST be implementable using FLOSS. {N/A allowed} [crypto_floss]
- The security mechanisms within the software produced by the project MUST use default keylengths that at least meet the NIST minimum requirements through the year 2030 (as stated in 2012). It MUST be possible to configure the software so that smaller keylengths are completely disabled. {N/A allowed} [crypto_keylength]
- The default security mechanisms within the software produced by the project MUST NOT depend on broken cryptographic algorithms (e.g., MD4, MD5, single DES, RC4, Dual_EC_DRBG), or use cipher modes that are inappropriate to the context, unless they are necessary to implement an interoperable protocol (where the protocol implemented is the most recent version of that standard broadly supported by the network ecosystem, that ecosystem requires the use of such an algorithm or mode, and that ecosystem does not offer any more secure alternative). The documentation MUST describe any relevant security risks and any known mitigations if these broken algorithms or modes are necessary for an interoperable protocol. {N/A allowed} [crypto_working]
- The default security mechanisms within the software produced by the project SHOULD NOT depend on cryptographic algorithms or modes with known serious weaknesses (e.g., the SHA-1 cryptographic hash algorithm or the CBC mode in SSH). {N/A allowed} [crypto_weaknesses]
- The security mechanisms within the software produced by the project SHOULD implement perfect forward secrecy for key agreement protocols so a session key derived from a set of long-term keys cannot be compromised if one of the long-term keys is compromised in the future. {N/A allowed} [crypto_pfs]
- If the software produced by the project causes the storing of passwords for authentication of external users, the passwords MUST be stored as iterated hashes with a per-user salt by using a key stretching (iterated) algorithm (e.g., Argon2id, Bcrypt, Scrypt, or PBKDF2). See also OWASP Password Storage Cheat Sheet. {N/A allowed} [crypto_password_storage]
- The security mechanisms within the software produced by the project MUST generate all cryptographic keys and nonces using a cryptographically secure random number generator, and MUST NOT do so using generators that are cryptographically insecure. {N/A allowed} [crypto_random]

### Secured delivery against man-in-the-middle (MITM) attacks

- The project MUST use a delivery mechanism that counters MITM attacks. Using https or ssh+scp is acceptable. [delivery_mitm]
- A cryptographic hash (e.g., a sha1sum) MUST NOT be retrieved over http and used without checking for a cryptographic signature. [delivery_unsigned]
- Publicly known vulnerabilities fixed
- There MUST be no unpatched vulnerabilities of medium or higher severity that have been publicly known for more than 60 days. [vulnerabilities_fixed_60_days]
- Projects SHOULD fix all critical vulnerabilities rapidly after they are reported. [vulnerabilities_critical_fixed]

### Other security issues
- The public repositories MUST NOT leak a valid private credential (e.g., a working password or private key) that is intended to limit public access. [no_leaked_credentials]

## Analysis
### Static code analysis

- At least one static code analysis tool (beyond compiler warnings and "safe" language modes) MUST be applied to any proposed major production release of the software before its release, if there is at least one FLOSS tool that implements this criterion in the selected language. {N/A justification} {Met justification} [static_analysis]
- It is SUGGESTED that at least one of the static analysis tools used for the static_analysis criterion include rules or approaches to look for common vulnerabilities in the analyzed language or environment. {N/A allowed} [static_analysis_common_vulnerabilities]
- All medium and higher severity exploitable vulnerabilities discovered with static code analysis MUST be fixed in a timely way after they are confirmed. {N/A allowed} [static_analysis_fixed]
- It is SUGGESTED that static source code analysis occur on every commit or at least daily. {N/A allowed} [static_analysis_often]

### Dynamic code analysis
- It is SUGGESTED that at least one dynamic analysis tool be applied to any proposed major production release of the software before its release. [dynamic_analysis]
- It is SUGGESTED that if the software produced by the project includes software written using a memory-unsafe language (e.g., C or C++), then at least one dynamic tool (e.g., a fuzzer or web application scanner) be routinely used in combination with a mechanism to detect memory safety problems such as buffer overwrites. If the project does not produce software written in a memory-unsafe language, choose "not applicable" (N/A). {N/A allowed} [dynamic_analysis_unsafe]
- It is SUGGESTED that the project use a configuration for at least some dynamic analysis (such as testing or fuzzing) which enables many assertions. In many cases these assertions should not be enabled in production builds. [dynamic_analysis_enable_assertions]
- All medium and higher severity exploitable vulnerabilities discovered with dynamic code analysis MUST be fixed in a timely way after they are confirmed. {N/A allowed} [dynamic_analysis_fixed]