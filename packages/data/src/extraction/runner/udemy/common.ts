// https://web.archive.org/web/20240328063702/https://www.udemy.com/developers/affiliate/models/user/
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

// https://web.archive.org/web/20240328063420/https://www.udemy.com/developers/affiliate/models/course/
export interface UdemyCourse {
  _class: 'course'
  id: number
  title: string
  visible_instructors: UdemyInstructor[]
  is_paid: boolean
  created: string
  description: string
}

export type UdemyCourseResponse = UdemyCourse

export const getCourseSlug = (url: string) => {
  const courseUrl = /^https?:\/\/www\.udemy\.com\/course\/(\S+)$/

  const match = courseUrl.exec(url)

  if (!match) return null

  const [, courseSlug] = match
  return courseSlug
}
