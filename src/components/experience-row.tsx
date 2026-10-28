import type { Experience } from '@/data/user-data';

export function ExperienceRow({
  experience,
  headingLevel = 'h2',
  showTech = false,
}: {
  experience: Experience;
  headingLevel?: 'h2' | 'h3';
  showTech?: boolean;
}) {
  const Heading = headingLevel;
  return (
    <article className="experience-row">
      <div>
        <Heading className="experience-company">{experience.company}</Heading>
        <p className="experience-meta">{experience.period.replaceAll('—', '–')}</p>
        <p className="experience-meta">{experience.location}</p>
      </div>
      <div className="prose">
        <h3>{experience.role}</h3>
        <ul>
          {experience.description.map((description) => (
            <li key={description}>{description}</li>
          ))}
        </ul>
        {showTech && <p>{experience.tech.join(' · ')}</p>}
      </div>
    </article>
  );
}
