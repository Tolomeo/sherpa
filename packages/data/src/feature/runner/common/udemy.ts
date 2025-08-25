export interface UdemyInstructor {
  _class: 'user'
  title: string
  name: string
  display_name: string
  job_title: string
  image_50x50: string
  image_100x100: string
  initials: string
  url: string
}
export interface UdemyCourse {
  _class: 'course'
  id: number
  title: string
  visible_instructors: UdemyInstructor[]
  is_paid: boolean
}

export type UdemyCourseResponse = UdemyCourse

export const getCourseSlug = (url: string) => {
  const courseUrl = /^https?:\/\/www\.udemy\.com\/course\/(\S+)$/

  const match = courseUrl.exec(url)

  if (!match) return null

  const [, courseSlug] = match
  return courseSlug
}
