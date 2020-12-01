package kubernetes.validating.images

test_mysql_is_not_allowed {
    deny with input as [{
        "kind": "AdmissionReview",
        "request": {
            "kind": {
                "kind": "Pod",
                "version": "v1"
            },
            "object": {
                "metadata": {
                    "name": "myapp"
                },
                "spec": {
                    "containers": [
                        {
                            "image": "hooli.com/nginx",
                            "name": "nginx-frontend"
                        },
                        {
                            "image": "mysql",
                            "name": "mysql-backend"
                        }
                    ]
                }
            }
        }
    }]

    deny != set()
}