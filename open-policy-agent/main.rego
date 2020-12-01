# Image Safety
# ------------
#
# This example prevents Kubernetes Pods from using containers from untrusted image
# registries. For simplicity, this example does NOT cover initContainers. To
# implement this policy, the rule needs to _search_ across the array of containers
# contained in every Pod resource. This example shows how to:
#
#	* Use the 'some' keyword to declare local variables.
#	* Iterate/search across JSON arrays.
#
# For additional information see:
#
#	* Rego `some` keyword: https://www.openpolicyagent.org/docs/latest/policy-language/#some-keyword
#	* Rego Iteration: https://www.openpolicyagent.org/docs/latest/#iteration

package kubernetes.validating.images

deny[msg] {
	# The `some` keyword declares local variables. This rule declares a variable
	# called `i`. The rule asks if there is some array index `i` such that the value
	# of the array element's `"image"` field does not start with "hooli.com/".
	some i
    some j
	input[i].request.kind.kind == "Pod"
	image := input[i].request.object.spec.containers[j].image
    name := input[i].request.object.spec.containers[j].name
	not startswith(image, "hooli.com/")
	msg := sprintf("Image '%v' comes '%v' from untrusted registry", [image, name])
}