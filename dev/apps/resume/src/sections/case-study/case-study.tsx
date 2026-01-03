import { Box, List, Text, Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '~/components/section/section';

import classes from './case-study.module.css';

export const CaseStudy = () => {
  return (
    <Section className={`${classes.caseStudy} caseStudySection section`}>
      <Title order={2}><Trans i18nKey='caseStudy.title'>Impact Case Study – Abridge</Trans></Title>

      <Box className={`${classes.noBreak} ${classes.caseStudySubSection} caseStudySubSection`}>
        <Title order={3}><Trans i18nKey='caseStudy.contextTitle'>Context</Trans></Title>
        <Text>
          <Trans i18nKey='caseStudy.contextContent'>
            Joined shortly after Series B ($30M), as the company prepared to onboard its first major enterprise customer.
            Engineering org (~10–15 engineers) had iterated rapidly to reach product-market fit,
            leaving the core audio-to-notes pipeline fragile, opaque, and increasingly risky to scale.
          </Trans>
        </Text>
      </Box>

      <Box className={`${classes.noBreak} ${classes.caseStudySubSection} caseStudySubSection`}>
        <Title order={3}><Trans i18nKey='caseStudy.roleScopeTitle'>Role & Scope</Trans></Title>
        <Text>
          <Trans i18nKey='caseStudy.roleScopeContent'>
            Acted as a horizontal senior technical leader, taking ownership of cross-cutting systems with no natural product owner.
            Led end-to-end redesign of the core audio-to-notes processing pipeline used by multiple product verticals;
            served as primary technical decision-maker and on-call escalation point until ownership transitioned to a dedicated team.
          </Trans>
        </Text>
      </Box>

      <Box className={`${classes.noBreak} ${classes.caseStudySubSection} caseStudySubSection`}>
        <Title order={3}><Trans i18nKey='caseStudyDecisions.title'>Key Decisions</Trans></Title>
        <List>
          <List.Item>
            <Trans i18nKey='caseStudyDecisions.reframing'>
              Reframed the audio-to-notes pipeline as a{' '}
              <strong>mission-critical internal product</strong> rather than a collection of ad-hoc functions.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudyDecisions.orchestration'>
              Architected the new isolated orchestration service using <strong>domain-driven design</strong>,
              deliberately separating pipeline concerns from product code to reduce blast radius and cognitive load.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudyDecisions.temporal'>
              <strong>Selected Temporal</strong> as the workflow execution layer to enable
              deterministic, debuggable workflows with replay capability —
              trading short-term learning cost for long-term reliability and operability.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudyDecisions.kubernetes'>
              Moved execution from cloud functions to <strong>Kubernetes-based services</strong> to
              regain debuggability, operational control, and vendor independence.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudyDecisions.singleWriter'>
              <strong>Centralized all database writes</strong> behind the pipeline,
              explicitly blocking direct ML access to prevent data corruption,
              race conditions, and side effects.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudyDecisions.singleWriter'>
              Required <strong>telemetry</strong> and <strong>observability</strong> mechanisms
              to ensure reliability at scale.
            </Trans>
          </List.Item>
        </List>
      </Box>

      <Box className={`${classes.caseStudySubSection} caseStudySubSection`}>
        <Title order={3}><Trans i18nKey='caseStudyContributions.title'>Contributions</Trans></Title>
        <List>
          <List.Item>
            <Trans i18nKey='caseStudyContributions.leadership'>
              Defined and owned <strong>architecture</strong>, <strong>technical product design</strong>, and{' '}
              <strong>implementation</strong> of the new pipeline from the ground up.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudyContributions.reverseEngineering'>
              <strong>Reverse-engineered</strong> implicit system behavior from
              legacy code to establish explicit baseline requirements,
              then defined forward-looking requirements under uncertain scale and evolving product needs.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudyContributions.apiBoundary'>
              Enforced a single <strong>standardized API boundary</strong> for all pipeline entry points,
              eliminating divergent implementations and making system behavior observable and predictable.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudyContributions.validationSchema'>
              Implemented <strong>document validation schemas</strong> for all I/O operations
              (database, APIs, blob storage…) to ensure data integrity.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudyContributions.testingLintingDocs'>
              Introduced <strong>end-to-end testing</strong>, strict linting standards,{' '}
              <strong>structured documentation</strong>, flow diagrams where none previously existed.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudyContributions.loadTests'>
              Built and ran <strong>load tests</strong> to validate scaling behavior prior to broad customer migration.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudyContributions.templates'>
              Designed <strong>reusable infrastructure</strong> and <strong>project templates</strong>{' '}
              (CI/CD, Helm charts, service scaffolding) that later became the foundation for other engineering efforts.
            </Trans>
          </List.Item>
        </List>
      </Box>

      <Box className={`${classes.noBreak} ${classes.caseStudySubSection} caseStudySubSection`}>
        <Title order={3}><Trans i18nKey='caseStudy.outcomesTitle'>Outcomes</Trans></Title>
        <List>
          <List.Item>
            <Trans i18nKey='caseStudy.outcomesCustomerMigration'>
              Successfully migrated the first enterprise customer to the new pipeline within ~7 months;
              completed <strong>full customer migration</strong> incrementally over the next ~2 months to minimize risk.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudy.outcomesPipelineThroughput'>
              The pipeline now processes over <strong>100 hours of audio per minute</strong>. It has met the needs
              of the business through significant growth in customer base and usage volume.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudy.outcomesReliability'>
              Achieved a step-change improvement in <strong>system reliability, debuggability, and operational visibility</strong>;
              for the first time, engineers could inspect live workflow state, diagnose failures deterministically, and recover safely.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudy.outcomesMonitoring'>
              Enabled the ability to build <strong>monitoring and alarms</strong> against
              telemetry to reduce reaction times to production issues.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudy.outcomesArchitecture'>
              Architecture <strong>scaled with company growth</strong> and became the foundation for subsequent pipeline work.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudy.outcomesTemplates'>
              Established <strong>reusable project templates</strong>{' '}
              (CI/CD, Helm charts, service layout) that were adopted across the engineering organization.
            </Trans>
          </List.Item>

          <List.Item>
            <Trans i18nKey='caseStudy.outcomesTemporalAdoption'>
              Temporal became a <strong>standard platform primitive</strong> reused well beyond the original pipeline project.
            </Trans>
          </List.Item>
        </List>
      </Box>

      <Box className={`${classes.noBreak} ${classes.caseStudySubSection} caseStudySubSection`}>
        <Title order={3}><Trans i18nKey='caseStudy.collaborationTitle'>Collaboration</Trans></Title>
        <Text>
          <Trans i18nKey='caseStudy.collaborationContent'>
            Worked in close partnership with the VP of Engineering, who sponsored the initiative as a critical business enabler.
            The project was self-initiated, proposed, and initially implemented
            solo before being transitioned to a dedicated team for long-term ownership.
          </Trans>
        </Text>
      </Box>

    </Section>
  );
};
