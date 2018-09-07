import Error from './error/error'
import Form from './form/form'
import Field from './field/field'
import Pagination from './pagination/pagination'

export default function (Vue) {
  Vue.component(Error.name, Error)
  Vue.component(Form.name, Form)
  Vue.component(Field.name, Field)
  Vue.component(Pagination.name, Pagination)
}
