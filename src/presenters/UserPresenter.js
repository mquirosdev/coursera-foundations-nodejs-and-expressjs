class UserPresenter {
  constructor(object) {
    this.object = object;
  }

  get values() {
    return {
      _id: this.object._id,
      name: this.object.name,
      email: this.object.email,
      status: this.object.status
    }
  }
}

export default UserPresenter;