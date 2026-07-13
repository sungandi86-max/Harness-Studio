import { Field, SelectInput, TextArea, TextInput } from "@/components/ui/Field"
import type { Asset, KnowledgeItem, Project, Prompt, Workflow } from "@/types/models"

export function ProjectFields({ project }: { readonly project: Project | undefined }) {
  return (
    <>
      <Field label="프로젝트 이름"><TextInput name="title" required defaultValue={project?.title} /></Field>
      <Field label="요약"><TextInput name="summary" required defaultValue={project?.summary} /></Field>
      <Field label="설명"><TextArea name="description" defaultValue={project?.description} /></Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="카테고리"><TextInput name="category" required defaultValue={project?.category ?? "AI Workspace"} /></Field>
        <Field label="상태"><SelectInput name="status" defaultValue={project?.status ?? "active"}><option value="idea">idea</option><option value="active">active</option><option value="paused">paused</option><option value="completed">completed</option><option value="archived">archived</option></SelectInput></Field>
        <Field label="진행률"><TextInput name="progress" type="number" min={0} max={100} defaultValue={project?.progress ?? 0} /></Field>
      </div>
      <Field label="목표"><TextInput name="goal" defaultValue={project?.goal} /></Field>
      <Field label="대상 사용자"><TextInput name="audience" defaultValue={project?.audience} /></Field>
      <Field label="문제"><TextInput name="problem" defaultValue={project?.problem} /></Field>
      <Field label="현재 상태"><TextInput name="currentState" defaultValue={project?.currentState} /></Field>
      <Field label="핵심 기능 (쉼표 구분)"><TextInput name="features" defaultValue={project?.features.join(", ")} /></Field>
      <Field label="기술 스택 (쉼표 구분)"><TextInput name="techStack" defaultValue={project?.techStack.join(", ")} /></Field>
      <Field label="제약조건 (쉼표 구분)"><TextInput name="constraints" defaultValue={project?.constraints.join(", ")} /></Field>
      <Field label="완료 조건 (쉼표 구분)"><TextInput name="completionCriteria" defaultValue={project?.completionCriteria.join(", ")} /></Field>
      <Field label="GitHub 링크"><TextInput name="githubUrl" type="url" defaultValue={project?.links.github} /></Field>
      <Field label="배포 링크"><TextInput name="deploymentUrl" type="url" defaultValue={project?.links.deployment} /></Field>
    </>
  )
}

export function PromptFields({ prompt }: { readonly prompt: Prompt | undefined }) {
  return (
    <>
      <Field label="제목"><TextInput name="title" required defaultValue={prompt?.title} /></Field>
      <Field label="요약"><TextInput name="summary" required defaultValue={prompt?.summary} /></Field>
      <Field label="목적"><TextInput name="purpose" defaultValue={prompt?.purpose} /></Field>
      <Field label="전체 프롬프트"><TextArea name="body" required defaultValue={prompt?.body} /></Field>
      <Field label="입력 자료"><TextInput name="inputs" defaultValue={prompt?.inputs} /></Field>
      <Field label="출력 형식"><TextInput name="outputFormat" defaultValue={prompt?.outputFormat} /></Field>
      <Field label="주의사항"><TextInput name="cautions" defaultValue={prompt?.cautions} /></Field>
      <Field label="카테고리"><TextInput name="category" defaultValue={prompt?.category ?? "General"} /></Field>
      <Field label="추천 AI"><TextInput name="recommendedAi" defaultValue={prompt?.recommendedAi ?? "ChatGPT"} /></Field>
      <Field label="연결 프로젝트 ID (쉼표 구분)"><TextInput name="projectIds" defaultValue={prompt?.projectIds.join(", ")} /></Field>
      <Field label="태그 (쉼표 구분)"><TextInput name="tags" defaultValue={prompt?.tags.join(", ")} /></Field>
    </>
  )
}

export function WorkflowFields({ workflow }: { readonly workflow: Workflow | undefined }) {
  return (
    <>
      <Field label="제목"><TextInput name="title" required defaultValue={workflow?.title} /></Field>
      <Field label="설명"><TextInput name="summary" required defaultValue={workflow?.summary} /></Field>
      <Field label="카테고리"><TextInput name="category" defaultValue={workflow?.category ?? "Build"} /></Field>
      <Field label="연결 프로젝트 ID (쉼표 구분)"><TextInput name="projectIds" defaultValue={workflow?.projectIds.join(", ")} /></Field>
    </>
  )
}

export function KnowledgeFields({ item }: { readonly item: KnowledgeItem | undefined }) {
  return (
    <>
      <Field label="제목"><TextInput name="title" required defaultValue={item?.title} /></Field>
      <Field label="유형"><SelectInput name="type" defaultValue={item?.type ?? "note"}><option value="note">note</option><option value="decision">decision</option><option value="lesson">lesson</option><option value="error">error</option><option value="tip">tip</option><option value="reference">reference</option><option value="snippet">snippet</option></SelectInput></Field>
      <Field label="요약"><TextInput name="summary" required defaultValue={item?.summary} /></Field>
      <Field label="내용"><TextArea name="content" required defaultValue={item?.content} /></Field>
      <Field label="연결 프로젝트 ID (쉼표 구분)"><TextInput name="projectIds" defaultValue={item?.projectIds.join(", ")} /></Field>
      <Field label="태그 (쉼표 구분)"><TextInput name="tags" defaultValue={item?.tags.join(", ")} /></Field>
      <Field label="참고 링크"><TextInput name="referenceUrl" type="url" defaultValue={item?.referenceUrl} /></Field>
    </>
  )
}

export function AssetFields({ asset }: { readonly asset: Asset | undefined }) {
  return (
    <>
      <Field label="제목"><TextInput name="title" required defaultValue={asset?.title} /></Field>
      <Field label="유형"><SelectInput name="type" defaultValue={asset?.type ?? "link"}><option value="image">image</option><option value="document">document</option><option value="pdf">pdf</option><option value="link">link</option><option value="brand">brand</option><option value="character">character</option><option value="reference">reference</option><option value="code">code</option></SelectInput></Field>
      <Field label="URL"><TextInput name="url" type="url" required defaultValue={asset?.url} /></Field>
      <Field label="미리보기 URL"><TextInput name="previewUrl" type="url" defaultValue={asset?.previewUrl} /></Field>
      <Field label="설명"><TextArea name="description" defaultValue={asset?.description} /></Field>
      <Field label="연결 프로젝트 ID (쉼표 구분)"><TextInput name="projectIds" defaultValue={asset?.projectIds.join(", ")} /></Field>
      <Field label="태그 (쉼표 구분)"><TextInput name="tags" defaultValue={asset?.tags.join(", ")} /></Field>
    </>
  )
}

export function AiFields() {
  return (
    <>
      <Field label="AI 이름"><TextInput name="name" required placeholder="예: Perplexity" /></Field>
      <Field label="역할"><TextInput name="role" required placeholder="예: Research Scout" /></Field>
      <Field label="담당 역할 (쉼표 구분)"><TextInput name="responsibilities" placeholder="자료 탐색, 비교, 요약" /></Field>
    </>
  )
}

export function RuleFields() {
  return (
    <>
      <Field label="규칙 제목"><TextInput name="title" required /></Field>
      <Field label="카테고리"><TextInput name="category" required defaultValue="작업 원칙" /></Field>
      <Field label="설명"><TextArea name="description" required /></Field>
    </>
  )
}
