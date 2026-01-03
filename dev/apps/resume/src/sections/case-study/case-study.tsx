import { List, Text, Title } from '@mantine/core';
import { Trans } from 'react-i18next';

import { Section } from '~/components/section/section';

import classes from './case-study.module.css';

export const CaseStudy = () => {
  return (
    <Section className={`${classes.caseStudy} caseStudy`}>
      <Title order={2}><Trans i18nKey='caseStudy.title'>Impact Case Study – Abridge</Trans></Title>

      <Title order={3}><Trans i18nKey='caseStudy.contextTitle'>Context</Trans></Title>
      <Text>
        <Trans i18nKey='caseStudy.contextContent'>
          Joined shortly after Series B ($30M), as the company prepared to onboard its first major enterprise customer.
          Engineering org (~10–15 engineers) had iterated rapidly to reach product-market fit,
          leaving the core audio-to-notes pipeline fragile, opaque, and increasingly risky to scale.
        </Trans>
      </Text>

      <Title order={3}><Trans i18nKey='caseStudy.roleScopeTitle'>Role & Scope</Trans></Title>
      <Text>
        <Trans i18nKey='caseStudy.roleScopeContent'>
          Acted as a horizontal senior technical leader, taking ownership of cross-cutting systems with no natural product owner.
          Led end-to-end redesign of the core audio-to-notes processing pipeline used by multiple product verticals;
          served as primary technical decision-maker and on-call escalation point until ownership transitioned to a dedicated team.
        </Trans>
      </Text>

      <Title order={3}><Trans i18nKey='caseStudy.contributionsDecisionsTitle'>Key Contributions & Decisions</Trans></Title>
      <List>
        <Trans i18nKey='caseStudy.contributionsDecisionsContent'>
          <List.Item>
            Reframed the audio-to-notes pipeline as a{' '}
            <strong>mission-critical internal product</strong> rather than a collection of ad-hoc functions.
          </List.Item>

          <List.Item>
            <strong>Reverse-engineered</strong> implicit system behavior from
            legacy code to establish explicit baseline requirements,
            then defined forward-looking requirements under uncertain scale and evolving product needs.
          </List.Item>

          <List.Item>
            Designed and implemented a new isolated orchestration service using <strong>domain-driven design</strong>,
            deliberately separating pipeline concerns from product code to reduce blast radius and cognitive load.
          </List.Item>

          <List.Item>
            Migrated execution from cloud functions to <strong>Kubernetes-based services</strong> to
            regain debuggability, operational control, and vendor independence.
          </List.Item>

          <List.Item>
            <strong>Selected Temporal</strong> as the workflow execution layer to enable
            deterministic, debuggable workflows with replay capability —
            trading short-term learning cost for long-term reliability and operability.
          </List.Item>

          <List.Item>
            Enforced a single <strong>standardized API boundary</strong> for all pipeline entry points,
            eliminating divergent implementations and making system behavior observable and predictable.
          </List.Item>

          <List.Item>
            Implemented <strong>document validation schemas</strong> for all I/O operations
            (database, APIs, blob storage…) to ensure data integrity.
          </List.Item>

          <List.Item>
            <strong>Centralized all database writes</strong> behind the pipeline,
            explicitly blocking direct ML access to prevent data corruption,
            race conditions, and side effects.
          </List.Item>

          <List.Item>
            Introduced <strong>end-to-end testing</strong>, strict linting standards,{' '}
            <strong>structured documentation</strong>, flow diagrams where none previously existed.
          </List.Item>

          <List.Item>
            Introduced <strong>comprehensive telemetry</strong> (logs, metrics, workflow visibility)
            to make system behavior understandable to the broader engineering organization.
          </List.Item>

          <List.Item>
            Built and ran <strong>load tests</strong> to validate scaling behavior prior to broad customer migration.
          </List.Item>

          <List.Item>
            Designed <strong>reusable infrastructure</strong> and <strong>project templates</strong>{' '}
            (CI/CD, Helm charts, service scaffolding) that later became the foundation for other engineering efforts.
          </List.Item>
        </Trans>
      </List>

      <Title order={3}><Trans i18nKey='caseStudy.outcomesTitle'>Key Contributions & Decisions</Trans></Title>
      <List>
        <Trans i18nKey='caseStudy.outcomesContent'>
          <List.Item>
            Successfully migrated the first enterprise customer to the new pipeline within ~7 months;
            completed <strong>full customer migration</strong> incrementally over the next ~2 months to minimize risk.
          </List.Item>

          <List.Item>
            The pipeline now processes over <strong>100 hours of audio per minute</strong>.
          </List.Item>

          <List.Item>
            Achieved a step-change improvement in <strong>system reliability, debuggability, and operational visibility</strong>;
            for the first time, engineers could inspect live workflow state, diagnose failures deterministically, and recover safely.
          </List.Item>

          <List.Item>
            Enabled the ability to build <strong>monitoring and alarms</strong> against
            telemetry to reduce reaction times to production issues.
          </List.Item>

          <List.Item>
            Architecture <strong>scaled with company growth</strong> and became the foundation for subsequent pipeline work.
          </List.Item>

          <List.Item>
            Established <strong>reusable project templates</strong>{' '}
            (CI/CD, Helm charts, service layout) that were adopted across the engineering organization.
          </List.Item>

          <List.Item>
            Temporal became a <strong>standard platform primitive</strong> reused well beyond the original pipeline project.
          </List.Item>
        </Trans>
      </List>

      <Title order={3}><Trans i18nKey='caseStudy.collaboration'>Collaboration</Trans></Title>
      <Text>
        <Trans i18nKey='caseStudy.collaboration'>
          Worked in close partnership with the VP of Engineering, who sponsored the initiative as a critical business enabler.
          The project was self-initiated, proposed, and initially implemented
          solo before being transitioned to a dedicated team for long-term ownership.
        </Trans>
      </Text>

    </Section>
  );
};
