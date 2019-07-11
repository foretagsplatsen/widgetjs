let id = 0;

export function newId() {
	id += 1;
	return id.toString();
}
